import { Outlet, NavLink } from "react-router-dom";
import "./MainLayout.css";

const MainLayout = () => {
    return (
        <div>
            <header className="app-header">
                <div className="logo">Employee Life Cycle</div>
                <nav className="nav-links">
                    <NavLink to="/">Dashboard</NavLink>
                    <NavLink to="/Task/1">Tasks</NavLink>
                    <NavLink to="Task/Create">Create Task</NavLink>
                    <NavLink to="/Settings">Settings</NavLink>
                </nav>
            </header>
            <Outlet /> {/* This is where child pages go */}
        </div>
    );
};

export default MainLayout;
