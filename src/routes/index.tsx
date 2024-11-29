import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/main";
import Home from "../pages/home";

const routes = createBrowserRouter([
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