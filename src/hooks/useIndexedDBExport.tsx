import { useState } from "react";
import { Bookmark, ExportedData } from "../types";
import { useIndexedDB } from "./useIndexedDB";

const useIndexedDBExport = (
    databaseName: string,
    objectStoreName: string
): [ExportedData, () => Promise<void>] => {
    const [db] = useIndexedDB(databaseName);
    const [exportedData, setExportedData] = useState<ExportedData>({
        bookmarks: [],
        error: null,
    });

    const fetchData = async (): Promise<Bookmark[]> => {
        if (!db) {
            throw new Error("IndexedDB connection not available");
        }

        const transaction = db.transaction(objectStoreName, 'readonly');
        const objectStore = transaction.objectStore(objectStoreName);
        const request = objectStore.getAll();

        return new Promise((resolve, reject) => {
            request.onerror = () => {
                reject(new Error('Failed to fetch data'));
            };

            request.onsuccess = () => {
                const data: Bookmark[] = request.result;
                resolve(data);
            };
        });
    };

    const handleExport = async (): Promise<void> => {
        try {
            const data = await fetchData();
            setExportedData({ bookmarks: data, error: null });

            const jsonData = JSON.stringify(data);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'indexeddb_data.json';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            setExportedData({ bookmarks: [], error: error as Error });
        }
    };

    return [exportedData, handleExport];
};

export default useIndexedDBExport;
