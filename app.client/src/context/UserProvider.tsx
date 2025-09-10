import React, { useEffect, useState } from "react";
import { UserContext, type UserContextType } from "./UserContext";
import { getCurrentUserRole, type MeResponse } from "../api/UserApi";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<UserContextType>({
        role: "User",
        email: null,
        loading: true,
    });

    useEffect(() => {
        getCurrentUserRole()
            .then((res: MeResponse) =>
                setState({ role: res.role, email: res.email, loading: false })
            )
            .catch(() =>
                setState({ role: "User", email: null, loading: false })
            );
    }, []);

    return (
        <UserContext.Provider value={state}>{children}</UserContext.Provider>
    );
};
