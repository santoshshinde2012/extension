import { useState, useEffect } from 'react';
import { useIndexedDB } from './useIndexedDB';

export function useIndexedDBCount(databaseName: string, storeName: string): [number | null, Error | null] {
    const [db, error] = useIndexedDB(databaseName);
    const [totalCount, setTotalCount] = useState<number | null>(null);

    useEffect(() => {
        async function getCount() {
            try {
                if (!db) {
                    throw new Error("IndexedDB connection not available");
                }
                const count = await getCountOfRecords(db, storeName);
                setTotalCount(count);
            } catch (error) {
                setTotalCount(null);
                console.error(error);
            }
        }

        getCount();

    }, [db, databaseName, storeName]);

    return [totalCount, error];
}

async function getCountOfRecords(db: IDBDatabase, storeName: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const objectStore = transaction.objectStore(storeName);

        const countRequest = objectStore.count();

        countRequest.onsuccess = (event: Event) => {
            const results = (event.target as IDBRequest).result;
            resolve(results);
        };

        countRequest.onerror = (event: Event) => {
            const error = (event.target as IDBRequest).error;
            console.error('Error fetching data:', error);
            reject(error);
        };
    });
}
