import Papa from "papaparse";

interface Course {
    Course: string;
    TimeToStart: string;
    DurationInLectureHours: string;
    Lecturer: string;
    Students: string[];
    Classroom: string;
}

const fetchCourses = async () => {
    const dbName = "CoursesDB";
    const dbExists = await checkDatabaseExists(dbName);

    if (dbExists) {
        return readFromDatabase(dbName);
    }

    try {
        const fileContent = await window.ipcRenderer.invoke("read-courses-file");
        return parseCsvData(fileContent);
    } catch {
        console.log("Could not read courses file from the local file system. Attempting to fetch from public/data/Courses.csv...");
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

const readFromDatabase = async (dbName: string): Promise<Course[]> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction("courses", "readonly");
            const store = transaction.objectStore("courses");
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => {
                resolve(getAllRequest.result as Course[]);
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

const parseCsvData = (data: string): Course[] => {
    let courses: Course[] = [];
    Papa.parse<Course>(data, {
        header: true,
        delimiter: ";",
        transform: (value) => value.trim(),
        complete: (results) => {
            courses = (results.data as unknown as Record<string, string>[]).map((row: Record<string, string>) => {
                const courseData: Course = {
                    Course: row.Course,
                    TimeToStart: row.TimeToStart,
                    DurationInLectureHours: row.DurationInLectureHours,
                    Lecturer: row.Lecturer,
                    Classroom: "unknown",
                    Students: Object.values(row)
                        .slice(4)
                        .filter(value => value !== "")
                        .map(value => value as string)
                };
                return courseData;
            });
        },
        error: () => {
            throw new Error("An error occurred while parsing the CSV data.");
        },
    });
    return courses;
};

const fetchFromPublic = async (): Promise<Course[]> => {
    const response = await fetch('/data/Courses.csv');
    if (!response.ok) {
        throw new Error("Failed to fetch the file from public/data/Courses.csv.");
    }
    const data = await response.text();
    return parseCsvData(data);
};

export { fetchCourses };