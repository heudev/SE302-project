import { CourseInterface } from "../store/courses";

export const updateIndexedDb = async (courses: CourseInterface[]) => {
    // Open the indexedDb database
    const request = indexedDB.open('CoursesDB', 1);

    request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('courses')) {
            db.createObjectStore('courses', { keyPath: 'Course' });
        }
    };

    request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction('courses', 'readwrite');
        const store = transaction.objectStore('courses');

        // Clear the existing data
        store.clear();

        // Add the new courses
        courses.forEach(course => {
            store.add(course);
        });

        transaction.oncomplete = () => {
            console.log('Courses updated in indexedDb');
        };

        transaction.onerror = (event) => {
            console.error('Error updating courses in indexedDb', event);
        };
    };

    request.onerror = (event) => {
        console.error('Error opening indexedDb', event);
    };
};
