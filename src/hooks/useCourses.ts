import { useState, useEffect } from "react";
import Papa from "papaparse";

interface Course {
    Course: string,
    TimeToStart: string,
    DurationInLectureHours: string,
    Lecturer: string,
    Students: string[]
}

export const useCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchAndParseCourses = async () => {
            try {
                const fileContent = await window.ipcRenderer.invoke("read-courses-file");
                Papa.parse(fileContent, {
                    header: true,
                    delimiter: ";",
                    transform: (value) => value.trim(),
                    complete: (results) => {
                        const processedData = (results.data as Record<string, string>[]).map((row: Record<string, string>) => ({
                            Course: row.Course,
                            TimeToStart: row.TimeToStart,
                            DurationInLectureHours: row.DurationInLectureHours,
                            Lecturer: row.Lecturer,
                            Students: Object.values(row)
                                .slice(4)
                                .filter(value => value !== "")
                                .map(value => value as string),
                        }));
                        setCourses(processedData);
                    },
                });
            } catch (err) {
                setError(err as Error);
            }
        };

        fetchAndParseCourses();
    }, []);

    return { courses, error };
};
