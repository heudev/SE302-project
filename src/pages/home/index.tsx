import Courses from "./courses"
import Classrooms from "./classrooms"
import Students from "./students"
export default function Home() {
    return (
        <div className="flex-grow flex justify-center space-x-4">
            <Courses />
            <Classrooms />
            <Students />
        </div>
    )
}