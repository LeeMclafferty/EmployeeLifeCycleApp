import { useMsal } from "@azure/msal-react";
import "./Header.css";
import { graphRequest } from "../../api/ApiClient";
import { useEffect, useState } from "react";

const LoginLogoutBtn = () => {
    const { instance, accounts } = useMsal();
    const [profilePic, setProfilePic] = useState<string | null>(null);

    const login = async () => {
        instance.loginRedirect({
            scopes: [
                "User.Read",
                "api://fa365569-1f50-47aa-a135-a559897501fb/UserImpersonation",
            ],
        });
    };

    const logout = () => {
        instance.logoutRedirect();
    };

    // Fetch profile photo after login
    useEffect(() => {
        const loadPhoto = async () => {
            if (accounts.length === 0) return;

            try {
                const tokenResponse = await instance.acquireTokenSilent({
                    scopes: ["User.Read"],
                    account: accounts[0],
                });

                const res = await fetch(
                    "https://graph.microsoft.com/v1.0/me/photo/$value",
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.accessToken}`,
                        },
                    }
                );

                if (res.ok) {
                    const blob = await res.blob();
                    setProfilePic(URL.createObjectURL(blob));
                } else if (res.status === 404) {
                    console.log("No profile photo found, using fallback");
                } else {
                    console.error("Graph error", res.status);
                }
            } catch (err) {
                console.error("Could not fetch profile photo", err);
            }
        };

        loadPhoto();
    }, [accounts, instance]);

    const isAuthenticated = accounts.length > 0;

    const getInitials = (name?: string) => {
        if (!name) return "";
        const parts = name.split(" ");
        const initials = parts.map((p) => p[0]).join("");
        return initials.substring(0, 2).toUpperCase(); // max 2 letters
    };

    return (
        <div id="outter-auth">
            {isAuthenticated ? (
                profilePic ? (
                    <img
                        src={profilePic}
                        id="logout-btn"
                        onClick={logout}
                        title="Logout"
                        alt="Profile"
                    />
                ) : (
                    <button id="logout-btn" onClick={logout} title="Logout">
                        {getInitials(accounts[0]?.name)}
                    </button>
                )
            ) : (
                <button id="login-btn" onClick={login}>
                    Login
                </button>
            )}
        </div>
    );
};

export default LoginLogoutBtn;
