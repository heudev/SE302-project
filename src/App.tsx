import Courses from "./components/Courses"
import Classroom from "./components/Classrooms"

export default function App() {
  return (
    <div className="flex gap-5">
      <Courses />
      <Classroom />
    </div>
  )
}
