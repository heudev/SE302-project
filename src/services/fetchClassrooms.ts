import Papa from "papaparse";

interface Classroom {
    Classroom: string;
    Capacity: string;
}

const fetchClassrooms = async () => {
    const dbName = "ClassroomsDB";
    const dbExists = await checkDatabaseExists(dbName);

    if (dbExists) {
        return readFromDatabase(dbName);
    }

    try {
        const fileContent = await window.ipcRenderer.invoke("read-classrooms-file");
        return parseCsvData(fileContent);
    } catch {
        console.log("Could not read classrooms file from the local file system. Attempting to fetch from public/data/ClassroomCapacity.csv...");
        return fetchFromPublic();
    }
};

const checkDatabaseExists = async (dbName: string) => {
    if (!indexedDB.databases) {
        console.log("Tarayıcı indexedDB.databases() API'sini desteklemiyor.");
        return false;
    }

    const databases = await indexedDB.databases();
    return databases.some(db => db.name === dbName);
};

const readFromDatabase = async (dbName: string): Promise<Classroom[]> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction("classrooms", "readonly");
            const store = transaction.objectStore("classrooms");
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => {
                resolve(getAllRequest.result as Classroom[]);
            };

            getAllRequest.onerror = () => {
                reject(new Error("Failed to read data from the database."));
            };
        };

        request.onerror = () => {
            reject(new Error("Failed to open the database."));
        };
    });
};

export const parseCsvData = (data: string): Classroom[] => {
    let classrooms: Classroom[] = [];
    Papa.parse<Classroom>(data, {
        header: true,
        complete: (results) => {
            classrooms = results.data;
        },
        error: () => {
            throw new Error("An error occurred while parsing the CSV data.");
        },
    });
    return classrooms;
};

const fetchFromPublic = async (): Promise<Classroom[]> => {
    const response = await fetch('/data/ClassroomCapacity.csv');
    if (!response.ok) {
        throw new Error("Failed to fetch the file from public/data/ClassroomCapacity.csv.");
    }
    const data = await response.text();
    return parseCsvData(data);
};

export { fetchClassrooms };