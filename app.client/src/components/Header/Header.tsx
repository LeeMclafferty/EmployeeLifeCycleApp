import { NavLink } from "react-router-dom";
import { getPersonRecordsByPhase } from "../../api/PersonRecordApi";
import {
    LifeCyclePhase,
    type PersonRecord,
} from "../../types/PersonRecordType";
import { useEffect, useState } from "react";
import "./Header.css";
import LoginLogoutBtn from "./LoginLogoutBtn";
import { useUser } from "../../hooks/UseUser";

const Header = () => {
    const [firstId, setFirstId] = useState<number | null>(null);
    const { role, email, loading } = useUser();

    useEffect(() => {
        const loadId = async () => {
            const id = await fetchFirstOnboardingId();
            setFirstId(id);
        };
        loadId();
    }, []);
    const fetchFirstOnboardingId = async () => {
        const records: PersonRecord[] = await getPersonRecordsByPhase(
            LifeCyclePhase.Onboarding
        );
        if (!records || records.length === 0) {
            return 0;
        }

        return records
            .filter((p) => p.id !== undefined)
            .reduce<number>((min, p) => (p.id! < min ? p.id! : min), Infinity);
    };

    return (
        <header className="app-header">
            <div className="logo">Employee Life Cycle</div>
            <nav className="nav-links">
                <NavLink to="/">Dashboard</NavLink>
                {role === "Admin" && (
                    <NavLink to="Person/Create">New Employee</NavLink>
                )}
                <NavLink to={`/Task/${firstId}`}>Tasks</NavLink>
                <NavLink to="Task/Create">New Task</NavLink>
                <NavLink to="/Settings">Settings</NavLink>
            </nav>
            <LoginLogoutBtn></LoginLogoutBtn>
        </header>
    );
};

export default Header;
