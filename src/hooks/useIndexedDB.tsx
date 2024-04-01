import { useState, useEffect } from 'react';

export function useIndexedDB(databaseName: string): [IDBDatabase | null, Error | null] {
    const [db, setDb] = useState<IDBDatabase | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let openedDB: IDBDatabase | null = null;

        const openDB = async () => {
            try {
                const db = await openDatabase(databaseName);
                if (db) {
                    setDb(db);
                } else {
                    setError(new Error("IndexedDB connection not available"));
                }
            } catch (error) {
                console.error('Error opening database:', error);
                setError(error as DOMException);
            }
        };

        if (!db) {
            openDB();
        }

        return () => {
            if (openedDB) {
                openedDB.close();
                setDb(null);
            }
        };
    }, [databaseName]);

    return [db, error];
}

const openDatabase = async (databaseName: string): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(databaseName, 1);

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event) => {
            reject((event.target as IDBOpenDBRequest).error);
        };
    });
};