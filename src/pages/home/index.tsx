import Courses from "./courses"
import Classrooms from "./classrooms"
import Students from "./students"
import { useCourses } from "../../hooks/useCourses";
import { useClassrooms } from "../../hooks/useClassrooms";
import { addItem as addCourse } from "../../database/tables/courses";
import { addItem as addClassroom } from "../../database/tables/classrooms";
import { getAllItems as getAllCourses } from "../../database/tables/courses";
import { getAllItems as getAllClassrooms } from "../../database/tables/classrooms";


let dbLock = false;

const acquireLock = async () => {
    while (dbLock) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    dbLock = true;
};

const releaseLock = () => {
    dbLock = false;
};

export default function Home() {
    const { courses, error: coursesError } = useCourses();
    const { classrooms, error: classroomsError } = useClassrooms();


    if (coursesError || classroomsError) {
        console.log(coursesError || classroomsError);
        return;
    }

    const saveData = async () => {
        await acquireLock();
        const existingCourses = await getAllCourses();
        const existingClassrooms = await getAllClassrooms();

        if (existingCourses.length === 0) {
            // Save courses to the database
            courses.forEach(course => {
                course.Classroom = "unknown";
                addCourse(course).catch(err => console.error("Failed to save course:", err));
            });
            console.log("Courses", courses);
        }

        if (existingClassrooms.length === 0) {
            // Save classrooms to the database
            classrooms.forEach(classroom => {
                addClassroom(classroom).catch(err => console.error("Failed to save classroom:", err));
            });
        }
        releaseLock();
    };

    saveData();



    if (coursesError || classroomsError) {
        return <div>Error loading data: {coursesError || classroomsError}</div>;
    }

    return (
        <div className="flex-grow flex justify-center space-x-4">
            <Courses />
            <Classrooms />
            <Students />
        </div>
    )
}