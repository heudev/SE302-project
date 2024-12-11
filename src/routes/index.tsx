import { createHashRouter } from "react-router-dom";
import MainLayout from "../layouts/main";
import Home from "../pages/home";
import Course from "../pages/course";
import Classroom from "../pages/classroom";
import Student from "../pages/student"; // Import the new Student page
const routes = createHashRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: '/coursePage/:courseId',
                element: <Course />
            },
            {
                path: '/classroom/:classroomId',
                element: <Classroom />
            },
            {
                path: '/student/:studentName', 
                element: <Student />
            }
            /* {
                path: 'explore',
                element: <Explore />
            }, */
        ]
    }
])

export default routes;