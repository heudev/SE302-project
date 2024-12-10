import { useState, useEffect } from "react";
import Papa from "papaparse";
import { openDB } from "idb";

interface Course {
    Course: string;
    TimeToStart: string;
    DurationInLectureHours: string;
    Lecturer: string;
    Students: string[];
    Classroom?: string;
}

const DATABASE_NAME = "coursesDB";
const STORE_NAME = "courses";

const useCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // IndexedDB data check
                const dbCourses = await getFromIndexedDB();
                if (dbCourses.length > 0) {
                    console.log("Loaded courses from IndexedDB");
                    setCourses(dbCourses);
                    return;
                }

                // Read from CSV
                const fileContent = await window.ipcRenderer.invoke("read-courses-file");
                parseCsvData(fileContent);
                console.log("Courses file read successfully from local file system");
            } catch {
                console.log("Could not read courses file from the local file system. Attempting to fetch from public/data/Courses.csv...");
                fetchFromPublic();
            }
        };

        const parseCsvData = (data: string) => {
            Papa.parse<Course>(data, {
                header: true,
                delimiter: ";",
                transform: (value) => value.trim(),
                complete: async (results) => {
                    const processedData = (results.data as unknown as Record<string, string>[]).map((row: Record<string, string>) => {
                        const courseData: Course = {
                            Course: row.Course,
                            TimeToStart: row.TimeToStart,
                            DurationInLectureHours: row.DurationInLectureHours,
                            Lecturer: row.Lecturer,
                            Students: Object.values(row)
                                .slice(4) // Slicing student values 
                                .filter(value => value !== "")
                                .map(value => value as string),
                            Classroom: row.Classroom || "Unknown",
                        };
                        return courseData;
                    });
                    setCourses(processedData);
                    await saveToIndexedDB(processedData); // Save to IndexedDB
                },
                error: () => {
                    setError("An error occurred while parsing the CSV data.");
                },
            });
        };

        const fetchFromPublic = () => {
            fetch('/data/Courses.csv')
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch the file from public/data/Courses.csv.");
                    }
                    return response.text();
                })
                .then(async (data) => {
                    parseCsvData(data); 
                    console.log("Fetched and saved courses from public/data/Courses.csv.");
                })
                .catch((err) => {
                    console.error(err.message);
                    setError(err.message);
                });
        };

        fetchCourses();
    }, []);

    const getFromIndexedDB = async (): Promise<Course[]> => {
        const db = await openDB(DATABASE_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "Course" });
                }
            },
        });
        return (await db.getAll(STORE_NAME)) || [];
    };

    const saveToIndexedDB = async (data: Course[]) => {
        const db = await openDB(DATABASE_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "Course" });
                }
            },
        });
        const tx = db.transaction(STORE_NAME, "readwrite");
        data.forEach((course) => {
            tx.store.put(course);
        });
        await tx.done;
        console.log("Courses saved to IndexedDB");
    };

    return { courses, error };
};

export { useCourses };
