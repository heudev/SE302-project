import { createHashRouter } from "react-router-dom";
import MainLayout from "../layouts/main";
import Home from "../pages/home";
import Course from "../pages/course"; 

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
            }
            /* {
                path: 'explore',
                element: <Explore />
            }, */
        ]
    }
])

export default routes;