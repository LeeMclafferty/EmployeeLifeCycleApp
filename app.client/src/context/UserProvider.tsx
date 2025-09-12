import React, { useEffect, useState } from "react";
import { UserContext, type UserContextType } from "./UserContext";
import { getCurrentUserRole, type MeResponse } from "../api/UserApi";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<UserContextType>({
        roles: [],
        email: null,
        loading: true,
    });

    useEffect(() => {
        getCurrentUserRole()
            .then((res: MeResponse) =>
                setState({ roles: res.roles, email: res.email, loading: false })
            )
            .catch(() => setState({ roles: [], email: null, loading: false }));
    }, []);

    return (
        <UserContext.Provider value={state}>{children}</UserContext.Provider>
    );
};
