import { apiRequest } from "./ApiClient";

export type MeResponse = {
    email: string;
    role: string;
};

export const getCurrentUserRole = () => apiRequest<MeResponse>("UserRole/me");
