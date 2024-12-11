import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from "../../services/fetchCourses";
import { fetchClassrooms } from "../../services/fetchClassrooms";
import { setCourses, CourseInterface } from "../../store/courses";
import { setClassrooms, ClassroomInterface } from "../../store/classrooms";
import Courses from './courses';
import Classrooms from './classrooms';
import Students from './students';

export default function Home() {
    const dispatch = useDispatch();

    useEffect(() => {
        fetchCourses().then(courses => {
            dispatch(setCourses(courses));
        });

    }, [dispatch]);

    useEffect(() => {
        fetchClassrooms().then(classrooms => {
            dispatch(setClassrooms(classrooms));
        });

    }, [dispatch]);

    const courses = useSelector((state: { courses: CourseInterface[] }) => state.courses);
    const classrooms = useSelector((state: { classrooms: ClassroomInterface[] }) => state.classrooms);

    console.log(courses);
    console.log(classrooms);


    return (
        <div className="flex-grow flex justify-center space-x-4">
            <Courses />
            <Classrooms />
            <Students />
        </div>
    );
}