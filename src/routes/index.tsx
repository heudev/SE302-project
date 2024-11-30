import { createHashRouter } from "react-router-dom";
import MainLayout from "../layouts/main";
import Home from "../pages/home";

const routes = createHashRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            /* {
                path: 'explore',
                element: <Explore />
            }, */
        ]
    }
])

export default routes;