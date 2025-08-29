import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { instance, accounts, inProgress } = useMsal();

    useEffect(() => {
        if (accounts.length === 0 && inProgress === "none") {
            instance.loginRedirect(loginRequest);
        }
    }, [accounts, inProgress, instance]);

    if (accounts.length === 0 || inProgress !== "none") {
        return <div>Loading authentication...</div>;
    }

    return <>{children}</>;
};
