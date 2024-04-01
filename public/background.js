let db = null;

function create_database() {
    const request = indexedDB.open('bookmarksDB');

    request.onerror = function () {}

    request.onupgradeneeded = function (event) {
        db = event.target.result;

        const objectStore = db.createObjectStore('bookmarks', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('title', 'title', { unique: false });
        objectStore.createIndex('url', 'url', { unique: true });

        objectStore.transaction.oncomplete = function () {}
    }

    request.onsuccess = function (event) {
        db = event.target.result;
    }
}

// Define a function to fetch meta information from a URL
function fetchMetaInformation(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then(html => {
                const metaInformation = {};

                // Regular expression to extract meta tags
                const metaTagRegex = /<meta\s+(?:[^>]*?\s+)?(?:name|property)="([^"]*?)"(?:[^>]*?\s+)?content="([^"]*?)"/gi;
                let match;
                while ((match = metaTagRegex.exec(html)) !== null) {
                    const key = match[1];
                    const value = match[2];
                    metaInformation[key] = value;
                }

                // Regular expression to extract image URL
                const imgTagRegex = /<img[^>]*?src="([^"]*?)"/i;
                const imgMatch = html.match(imgTagRegex);
                if (imgMatch) {
                    metaInformation['image'] = imgMatch[1];
                }

                // Regular expression to extract tags
                const tagRegex = /<meta\s+name="keywords"\s+content="([^"]*?)"/i;
                const tagMatch = html.match(tagRegex);
                if (tagMatch) {
                    metaInformation['tags'] = tagMatch[1].split(',');
                }

                // Regular expression to extract author name
                const authorRegex = /<meta\s+name="author"\s+content="([^"]*?)"/i;
                const authorMatch = html.match(authorRegex);
                if (authorMatch) {
                    metaInformation['author'] = authorMatch[1];
                }
                metaInformation['status'] = true;

                resolve(metaInformation);
            })
            .catch(() => {
                resolve({ status: false });
            });
    });
}

async function storeBookmark(bookmark) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['bookmarks'], 'readwrite');
        const objectStore = transaction.objectStore('bookmarks');
        const request = objectStore.add(bookmark);
        request.onsuccess = function () {};
        request.onerror = function () {};
        transaction.oncomplete = () => {
            resolve();
        };
        transaction.onerror = () => {
            reject(transaction.error);
        };
    });
}


async function flattenBookmarks(bookmarks, folder) {
    for (const element of bookmarks) {
        const {
            id,
            parentId,
            title,
            dateAdded,
            dateGroupModified,
            url,
            children
        } = element;
        if (url && (!url.startsWith("file:") || !url.startsWith("chrome:"))) {
            fetchMetaInformation(url)
                .then((metaInformation) => {
                    const bookmark = {
                        id,
                        parentId,
                        title: title,
                        dateAdded,
                        dateGroupModified,
                        url,
                        folder,
                        image: metaInformation['image'],
                        originalTitle: metaInformation['og:title'],
                        originalImage: metaInformation['og:image'],
                        type: metaInformation['og:type'],
                        keywords: metaInformation['keywords'],
                        description: metaInformation['description'],
                        author: metaInformation['author'],
                        status: metaInformation['status']
                    }
                    storeBookmark(bookmark)
                        .then(() => {})
                        .catch(() => { });
                })
        } else if (!children) {
            const bookmark = {
                id,
                parentId,
                title: title,
                dateAdded,
                dateGroupModified,
                url,
                folder,
                status: true
            }
            storeBookmark(bookmark)
                .then(() => {})
                .catch(() => { });
        }
        if (children) {
            flattenBookmarks(children, title);
        }
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    const { action } = message;
    if (action == "SYNK") {
        chrome.bookmarks.getTree(function (tree) {
            flattenBookmarks(tree, '');
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.bookmarks.getTree(function (tree) {
        flattenBookmarks(tree, '');
    });
});

create_database();

