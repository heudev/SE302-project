import { useState, useEffect } from "react";
import Papa from "papaparse";

interface Classroom {
    Classroom: string,
    Capacity: string
}

export const useClassrooms = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const fileContent = await window.ipcRenderer.invoke("read-classrooms-file");
                Papa.parse(fileContent, {
                    header: true,
                    complete: (results: Papa.ParseResult<Classroom>) => {
                        setClassrooms(results.data);
                    },
                    error: (err) => {
                        setError(err as Error);
                    },
                });
            } catch (err) {
                setError(err as Error);
            }
        };

        fetchClassrooms();
    }, []);

    return { classrooms, error };
};
