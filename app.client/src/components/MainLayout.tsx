import { Outlet } from "react-router-dom";
import "./MainLayout.css";
import Header from "./Header/Header";

// Tasks page needs to append /{id} of the lowest number "onboarding person in db"
const MainLayout = () => {
    return (
        <div>
            <Header></Header>
            <Outlet /> {/* This is where child pages go */}
        </div>
    );
};

export default MainLayout;
