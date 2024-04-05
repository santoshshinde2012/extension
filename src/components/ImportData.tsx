import React, { useState } from 'react';
import { Bookmark } from '../types';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { databaseName, bookmarkStoreName } from '../constants';

const ImportData = () => {
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [db] = useIndexedDB(databaseName);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleImportData = async () => {
        setErrorMessage(null);

        if (!file) {
            setErrorMessage('No file selected');
            return;
        }

        try {
            const jsonData = await readFileAsJson(file);
            await importDataToIndexedDB(jsonData);
            console.log('Data imported successfully');
        } catch (error) {
            setErrorMessage('Failed to import data');
            console.error('Failed to import data:', error);
        }
    };

    const readFileAsJson = (file: File): Promise<Bookmark[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const jsonData = JSON.parse(reader.result as string);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error('Failed to parse JSON'));
                }
            };
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            reader.readAsText(file);
        });
    };

    const importDataToIndexedDB = async (data: Bookmark[]) => {
        try {
            if (!db) {
                throw new Error("IndexedDB connection not available");
            }
            const transaction = db.transaction(bookmarkStoreName, 'readwrite');
            const objectStore = transaction.objectStore(bookmarkStoreName);
            for (const record of data) {
                objectStore.add(record);
            }
        } catch (error) {
            throw new Error('Failed to import data to IndexedDB');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
            <input type="file" onChange={handleFileChange} accept=".json" className="mb-4" />
            {errorMessage && (
                <div className="text-red-600 mb-4">{errorMessage}</div>
            )}
            <button onClick={handleImportData} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Import Data
            </button>
        </div>
    );
};

export default ImportData;
