import { createContext } from "react";

export type UserContextType = {
    role: string;
    email: string | null;
    loading: boolean;
};

export const UserContext = createContext<UserContextType>({
    role: "User",
    email: null,
    loading: true,
});
