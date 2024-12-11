import { createHashRouter } from "react-router-dom";
import MainLayout from "../layouts/main";
import Home from "../pages/home";
import Course from "../pages/course"; 
import Classroom from "../pages/classroom"; 
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
                path: '/classroom/:classroomId', // This should be the correct route
                element: <Classroom />
            }
            /* {
                path: 'explore',
                element: <Explore />
            }, */
        ]
    }
])

export default routes;