import { useState, useEffect } from "react";
import Papa from "papaparse";
import { openDB } from "idb";

interface Classroom {
    Classroom: string;
    Capacity: string;
}

const DATABASE_NAME = "classroomsDB";
const STORE_NAME = "classrooms";

const useClassrooms = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                // Check indexedDB
                const dbClassrooms = await getFromIndexedDB();
                if (dbClassrooms.length > 0) {
                    console.log("Loaded classrooms from IndexedDB");
                    setClassrooms(dbClassrooms);
                    return;
                }

                // Read
                const fileContent = await window.ipcRenderer.invoke("read-classrooms-file");
                parseCsvData(fileContent);
                
                console.log("Classrooms file read successfully from local file system");
            } catch {
                console.log("Could not read classrooms file from the local file system. Attempting to fetch from public/data/ClassroomCapacity.csv...");
                fetchFromPublic();
            }
        };

        const parseCsvData = (data: string) => {
            Papa.parse<Classroom>(data, {
                header: true,
                delimiter: ";", 
                transform: (value) => value.trim(),
                complete: async (results) => {
                    const processedData = (results.data as unknown as Record<string, string>[]).map((row: Record<string, string>) => {
                        const classroomData: Classroom = {
                            Classroom: row.Classroom, // Mapping
                            Capacity: row.Capacity      
                        };
                        return classroomData;
                    });
                    setClassrooms(processedData); 
                    await saveToIndexedDB(processedData); 
                },
                error: () => {
                    setError("An error occurred while parsing the CSV data.");
                },
            });
        };
        

        const fetchFromPublic = () => {
            fetch('/data/ClassroomCapacity.csv')
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch the file from public/data/ClassroomCapacity.csv.");
                    }
                    return response.text();
                })
                .then(data => parseCsvData(data))
                .catch((err) => {
                    console.error(err.message);
                    setError(err.message);
                });
        };
        
        fetchClassrooms();
    }, []);

   
    const getFromIndexedDB = async (): Promise<Classroom[]> => {
        const db = await openDB(DATABASE_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "Classroom" });
                }
            },
        });
        return (await db.getAll(STORE_NAME)) || [];
    };

    const saveToIndexedDB = async (data: Classroom[]) => {
        const db = await openDB(DATABASE_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "Classroom" });
                }
            },
        });
        const tx = db.transaction(STORE_NAME, "readwrite");
        data.forEach((classroom) => {
            tx.store.put(classroom);
        });
        await tx.done;
        console.log("Classrooms saved to IndexedDB");
    };

    return { classrooms, error };
};

export { useClassrooms };
