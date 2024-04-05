import { useState, useEffect } from 'react';
import { useIndexedDB } from './useIndexedDB';
import { Bookmark, FolderMap } from '../types';
import { databaseName, bookmarkStoreName } from '../constants';


export function useIndexedDBSearch(searchTerm: string): [FolderMap | undefined, Error | null] {
    const [db] = useIndexedDB(databaseName);
    const [foldersMap, setFoldersMap] = useState<FolderMap>();
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchRecords() {
            try {
                if (!db) {
                    throw new Error("IndexedDB connection not available");
                }
                const foldersMap = await getRecordsFromDB(db, bookmarkStoreName, searchTerm);
                setFoldersMap(foldersMap);
            } catch (error) {
                setError(error as DOMException);
            }
        }

        fetchRecords();
    }, [db, searchTerm]);

    return [foldersMap, error];
}
async function getRecordsFromDB(db: IDBDatabase, bookmarkStoreName: string, searchTerm: string): Promise<FolderMap> {
    return new Promise<FolderMap>((resolve, reject) => {
        const transaction = db.transaction(bookmarkStoreName, "readonly");
        const objectStore = transaction.objectStore(bookmarkStoreName);
        const foldersMap: FolderMap = new Map<string, Bookmark[]>();
        const request = objectStore.openCursor();
        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
                const record: Bookmark = cursor.value;
                const folder = record.folder;
                if (!searchTerm || checkRecordForSearchTerm(record, searchTerm)) {
                    updateFolderMap(foldersMap, folder, record);
                }
                cursor.continue();
            } else {
                resolve(foldersMap);
            }
        };

        request.onerror = () => {
            reject(new Error("Error fetching records from database"));
        };
    });
}

function checkRecordForSearchTerm(record: Bookmark, searchTerm: string): boolean {
    const searchTerms = searchTerm.split(' ').filter(term => term.trim() !== '');
    return searchTerms.some(term =>
        record.title.includes(term) ||
        record.url.includes(term) ||
        (record.type !== undefined && record.type.includes(term)) ||
        (record.keywords !== undefined && record.keywords.includes(term)) ||
        (record.description !== undefined && record.description.includes(term)) ||
        (record.originalTitle !== undefined && record.originalTitle.includes(term))
    );
}

function updateFolderMap(foldersMap: FolderMap, folder: string, bookmark: Bookmark) {
    if (foldersMap.has(folder)) {
        const bookmarks = foldersMap.get(folder) || [];
        const index = bookmarks.findIndex(b => bookmark.dateAdded < b.dateAdded);
        if (index !== -1) {
            bookmarks.splice(index, 0, bookmark);
        } else {
            bookmarks.push(bookmark);
        }
        foldersMap.set(folder, bookmarks);
    } else {
        foldersMap.set(folder, [bookmark]);
    }
}