import { createContext } from "react";

export type UserContextType = {
    roles: string[];
    email: string | null;
    loading: boolean;
};

export const UserContext = createContext<UserContextType>({
    roles: [],
    email: null,
    loading: true,
});
