import { useEffect, useState } from 'react';
import { SyncStatus } from '../types';
import { useIndexedDB } from './useIndexedDB';
import { databaseName, syncStoreName } from '../constants';

export const useSyncStatus = (): SyncStatus => {
    const [db] = useIndexedDB(databaseName);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>({ status: false });

    useEffect(() => {
        const getStatus = async () => {
            try {
                if (db) {
                    const result = await getSyncStatus(db, syncStoreName);
                    setSyncStatus(result);
                }
            } catch (error) {
                setSyncStatus({ status: true });
                console.error(error);
            }

        };

        getStatus();

    }, [db]);
    return syncStatus;
};




async function getSyncStatus(db: IDBDatabase, storeName: string): Promise<SyncStatus> {
    return new Promise<SyncStatus>((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const objectStore = transaction.objectStore(storeName);

        const request = objectStore.get('status');

        request.onsuccess = (event: Event) => {
            const result = (event.target as IDBRequest).result;
            resolve(result);
        };

        request.onerror = (event: Event) => {
            const error = (event.target as IDBRequest).error;
            console.error('Error fetching data:', error);
            reject(error);
        };
    });
}
