import { useState, useEffect } from "react";
import Papa from "papaparse";

interface Classroom {
    Classroom: string;
    Capacity: string;
}

const useClassrooms = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
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
                complete: (results) => {
                    setClassrooms(results.data);
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

    return { classrooms, error };
};

export { useClassrooms };