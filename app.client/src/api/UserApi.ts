import { apiRequest } from "./ApiClient";

export type MeResponse = { email: string; roles: string[] };

export const getCurrentUserRole = () => apiRequest<MeResponse>("UserRole/me");
