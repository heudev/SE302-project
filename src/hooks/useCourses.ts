import { useState, useEffect } from "react";
import Papa from "papaparse";

interface Course {
    Course: string;
    TimeToStart: string;
    DurationInLectureHours: string;
    Lecturer: string;
    Students: string[];
}

const useCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
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
                complete: (results) => {
                    const processedData = (results.data as unknown as Record<string, string>[]).map((row: Record<string, string>) => {
                        const courseData: Course = {
                            Course: row.Course,
                            TimeToStart: row.TimeToStart,
                            DurationInLectureHours: row.DurationInLectureHours,
                            Lecturer: row.Lecturer,
                            Students: Object.values(row)
                                .slice(4)
                                .filter(value => value !== "")
                                .map(value => value as string)
                        };
                        return courseData;
                    });
                    setCourses(processedData);
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
                .then(data => parseCsvData(data))
                .catch((err) => {
                    console.error(err.message);
                    setError(err.message);
                });
        };

        fetchCourses();
    }, []);

    return { courses, error };
};

export { useCourses };