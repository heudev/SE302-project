import Courses from "./courses"
import Classrooms from "./classrooms"
export default function Home() {
    return (
        <div className="flex-grow flex justify-center space-x-4">
            <Courses />
            <Classrooms />
        </div>
    )
}