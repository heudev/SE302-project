interface Classroom {
    Classroom: string;
    Capacity: string;
}

const dbName = 'ClassroomsDB';
const storeName = 'Classrooms';

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event) => {
            reject('Database error: ' + (event.target as IDBOpenDBRequest).error);
        };
    });
};

export const getAllItems = async (): Promise<Classroom[]> => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    return new Promise<Classroom[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
            console.log("request", request.result);
            resolve(request.result);
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
};

export const addItem = async (item: Classroom): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    await store.add(item);
};

export const updateItem = async (item: Classroom): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    await store.put(item);
};

export const deleteItem = async (id: number): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    await store.delete(id);
};
