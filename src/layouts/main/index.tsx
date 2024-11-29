import { Outlet } from "react-router-dom";
import AppBar from "./appbar";

export default function MainLayout() {
    return (
        <div className="h-screen flex flex-col">
            <AppBar />
            <Outlet />
        </div>
    )
}