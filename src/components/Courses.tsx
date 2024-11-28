import { useCourses } from "../hooks/useCourses";

export default function Courses() {
    const { courses, error } = useCourses();

    if (error) {
        return <div>Error loading courses: {error.message}</div>;
    }

    console.log(courses);

    return (
        <div>
            {courses.map(course => (
                <div key={course.Course}>
                    <h2>{course.Course}</h2>
                </div>
            ))}
        </div>
    );
}