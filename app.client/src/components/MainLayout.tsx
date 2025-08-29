import { Outlet, NavLink } from "react-router-dom";
import "./MainLayout.css";
import { getPersonRecordsByPhase } from "../api/PersonRecordApi";
import { LifeCyclePhase, type PersonRecord } from "../types/PersonRecordType";
import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";

// Tasks page needs to append /{id} of the lowest number "onboarding person in db"
const MainLayout = () => {
    const [firstId, setFirstId] = useState<number | null>(null);

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

    const { instance, accounts } = useMsal();

    const login = () => {
        instance.loginRedirect({
            scopes: [
                "api://fa365569-1f50-47aa-a135-a559897501fb/UserImpersonation",
            ],
        });
    };

    const logout = () => {
        instance.logoutRedirect();
    };

    const isAuthenticated = accounts.length > 0;

    return (
        <div>
            <header className="app-header">
                <div className="logo">Employee Life Cycle</div>
                <nav className="nav-links">
                    <NavLink to="/">Dashboard</NavLink>
                    <NavLink to="Person/Create">New Employee</NavLink>
                    <NavLink to={`/Task/${firstId}`}>Tasks</NavLink>
                    <NavLink to="Task/Create">New Task</NavLink>
                    <NavLink to="/Settings">Settings</NavLink>
                </nav>

                {/* Login / Logout button */}
                <div className="auth-button">
                    {isAuthenticated ? (
                        <button onClick={logout}>Logout</button>
                    ) : (
                        <button onClick={login}>Login</button>
                    )}
                </div>
            </header>
            <Outlet /> {/* This is where child pages go */}
        </div>
    );
};

export default MainLayout;
