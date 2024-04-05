
const databaseName = 'bookmarksDB';
const bookmarkStoreName = 'bookmarks';
const syncStoreName = 'sync';

type DBIndex = {
    name: string;
    keyPath: string | Iterable<string>;
    options?: IDBIndexParameters;
}

interface MetaInformation {
    [key: string]: string | string[] | boolean | undefined;
}

let db!: IDBDatabase;

async function openDB(): Promise<void> {
    return new Promise((resolve, reject) => {
        const request: IDBOpenDBRequest = indexedDB.open(databaseName);

        request.onerror = (event: Event) => {
            reject((event.target as IDBOpenDBRequest).error);
        };

        request.onsuccess = (event: Event) => {
            db = (event.target as IDBOpenDBRequest).result;
            resolve();
        };

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            db = (event.target as IDBOpenDBRequest).result;
            db.createObjectStore(bookmarkStoreName, { keyPath: 'url' });
            db.createObjectStore(syncStoreName, { keyPath: 'id' });

        };
    });
}

async function addOrUpdateRecord(storeName: string, keyPath: string, record: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);

        const getRequest = objectStore.get(record[keyPath]);

        getRequest.onsuccess = (event: Event) => {
            const existingRecord: any = (event.target as IDBRequest).result;
            if (existingRecord) {
                // If the record already exists, update it
                const updatedRecord = { ...existingRecord, ...record };
                const putRequest = objectStore.put(updatedRecord);

                putRequest.onsuccess = () => {
                    resolve();
                };

                putRequest.onerror = (event: Event) => {
                    reject((event.target as IDBRequest).error);
                };
            } else {
                // If the record doesn't exist, add it
                const addRequest = objectStore.add(record);

                addRequest.onsuccess = () => {
                    resolve();
                };

                addRequest.onerror = (event: Event) => {
                    reject((event.target as IDBRequest).error);
                };
            }
        };

        getRequest.onerror = (event: Event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}


// Define a function to fetch meta information from a URL
async function fetchMetaInformation(url: string): Promise<MetaInformation> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const html = await response.text();
        const metaInformation: any = {};

        const metaTagRegex = /<meta\s+(?:[^>]*?\s+)?(?:name|property)="([^"]*?)"(?:[^>]*?\s+)?content="([^"]*?)"/gi;
        let match;
        while ((match = metaTagRegex.exec(html)) !== null) {
            const key = match[1];
            const value = match[2];
            metaInformation[key] = value;
        }

        const imgTagRegex = /<img[^>]*?src="(https?:\/\/[^"]*?\.(?!(gif(?:$|\?)))[^\s"]*?)"/i;
        const imgMatch = RegExp(imgTagRegex).exec(html);
        if (imgMatch) {
            metaInformation['image'] = imgMatch[1];
        }

        const tagRegex = /<meta\s+name="keywords"\s+content="([^"]*?)"/i;
        const tagMatch = RegExp(tagRegex).exec(html);
        if (tagMatch) {
            metaInformation['tags'] = tagMatch[1].split(',');
        }

        const authorRegex = /<meta\s+name="author"\s+content="([^"]*?)"/i;
        const authorMatch = RegExp(authorRegex).exec(html);
        if (authorMatch) {
            metaInformation['author'] = authorMatch[1];
        }

        metaInformation['status'] = true;
        return metaInformation;
    } catch (error) {
        return { status: false };
    }
}

async function handleBookmark(bookmark: any): Promise<void> {
    let metaInformation: any = {};
    if (bookmark.url && !(bookmark.url.startsWith("file:") || bookmark.url.startsWith("chrome:"))) {
        metaInformation = await fetchMetaInformation(bookmark.url);
        metaInformation = {
            image: metaInformation['image'],
            originalTitle: metaInformation['og:title'],
            originalImage: metaInformation['og:image'],
            type: metaInformation['og:type'],
            keywords: metaInformation['keywords'],
            description: metaInformation['description'],
            author: metaInformation['author'],
            status: metaInformation['status'] || true
        }
    }
    await addOrUpdateRecord(bookmarkStoreName, 'url', { ...bookmark, ...metaInformation });
}

async function flattenBookmarks(bookmarks: any[], folder: string): Promise<void> {
    const tasks: Promise<void>[] = [];

    for (let bookmark of bookmarks) {
        const { children, title } = bookmark;
        if (children) {
            tasks.push(flattenBookmarks(children, title));
        } else {
            bookmark.folder = folder;
            tasks.push(handleBookmark(bookmark));
        }
    }

    await Promise.all(tasks);
}

async function execute(): Promise<void> {

    await openDB();

    await addOrUpdateRecord(syncStoreName, 'id', { id: 'status', status: false, lastSynced: Date.now() });

    chrome.bookmarks.getTree(async function (tree) {
        await flattenBookmarks(tree, '');
    });

    await addOrUpdateRecord(syncStoreName, 'id', { id: 'status', status: true, lastSynced: Date.now() });
}

chrome.runtime.onMessage.addListener(async function (message, _sender, _sendResponse) {
    const { action } = message;
    if (action == "SYNK") {
        await execute();
        chrome.runtime.sendMessage({ action: "DONE" });
    }
});

chrome.runtime.onInstalled.addListener(async () => {
    await execute();
});