import AppBar from "./components/AppBar"
import Courses from "./components/Courses"

export default function App() {
  return (
    <div className="h-screen flex flex-col">
      <AppBar />
      <div className="flex-grow flex justify-center">
        <Courses />
      </div>
    </div>
  )
}