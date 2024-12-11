import { ClassroomInterface } from "../store/classrooms";

export const updateIndexedDb = async (classrooms: ClassroomInterface[]) => {
    // Open the indexedDb database
    const request = indexedDB.open('ClassroomsDB', 1);

    request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('classrooms')) {
            db.createObjectStore('classrooms', { keyPath: 'Classroom' });
        }
    };

    request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction('classrooms', 'readwrite');
        const store = transaction.objectStore('classrooms');

        // Clear the existing data
        store.clear();

        // Add the new classrooms
        classrooms.forEach(classroom => {
            store.add(classroom);
        });

        transaction.oncomplete = () => {
            console.log('classrooms updated in indexedDb');
        };

        transaction.onerror = (event) => {
            console.error('Error updating classrooms in indexedDb', event);
        };
    };

    request.onerror = (event) => {
        console.error('Error opening indexedDb', event);
    };
};
