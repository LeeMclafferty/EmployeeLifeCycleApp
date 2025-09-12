import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const useUser = () => {
    const { roles, email, loading } = useContext(UserContext);

    // check if user has at least one of the required roles
    const hasRole = (required: string[]): boolean =>
        roles.some((role) => required.includes(role));

    // shortcut for common cases
    const isSuperAdmin = roles.includes("SuperAdmin");

    return { roles, email, loading, hasRole, isSuperAdmin };
};
