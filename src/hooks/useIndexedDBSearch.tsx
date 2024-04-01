import { useState, useEffect } from 'react';
import { useIndexedDB } from './useIndexedDB';
import { Bookmark, FolderMap } from '../types';
import { databaseName, objectStoreName } from '../constants';


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
                const foldersMap = await getRecordsFromDB(db, objectStoreName, searchTerm);
                setFoldersMap(foldersMap);
            } catch (error) {
                setError(error as DOMException);
            }
        }

        fetchRecords();
    }, [searchTerm]);

    return [foldersMap, error];
}
async function getRecordsFromDB(db: IDBDatabase, objectStoreName: string, searchTerm: string): Promise<FolderMap> {
    return new Promise<FolderMap>((resolve, reject) => {
        const transaction = db.transaction(objectStoreName, "readonly");
        const objectStore = transaction.objectStore(objectStoreName);
        const foldersMap: FolderMap = new Map<string, Bookmark[]>();

        const request = objectStore.openCursor();
        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
                const record: Bookmark = cursor.value;
                const folder = record.folder;
                if (searchTerm && (
                    record.title.includes(searchTerm) ||
                    record.url.includes(searchTerm) ||
                    (record.type && record.type.includes(searchTerm)) ||
                    (record.keywords && record.keywords.includes(searchTerm)) ||
                    (record.description && record.description.includes(searchTerm)) ||
                    (record.originalTitle && record.originalTitle.includes(searchTerm))
                )) {
                    if (foldersMap.has(folder)) {
                        foldersMap.get(folder)?.push(record);
                    } else {
                        foldersMap.set(folder, [record]);
                    }
                } else {
                    if (foldersMap.has(folder)) {
                        foldersMap.get(folder)?.push(record);
                    } else {
                        foldersMap.set(folder, [record]);
                    }
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
