import { type UserRole } from "../types/UserRole";
import { apiRequest } from "./ApiClient";

export type MeResponse = { email: string; roles: string[] };

export const getCurrentUserRole = () => apiRequest<MeResponse>("UserRole/me");

export const getUsers = () => apiRequest<UserRole[]>("UserRole/Roles");

export const addUserRole = (userRole: UserRole) =>
    apiRequest<UserRole, UserRole>("UserRole", "POST", userRole);

export const updateUserRole = (id: number, userRole: UserRole) =>
    apiRequest<void, UserRole>(`UserRole/${id}`, "PUT", userRole);

// ✅ Delete a role entry
export const deleteUserRole = async (email: string, role: string) =>
    await apiRequest<void>(
        `UserRole/${encodeURIComponent(email)}/${encodeURIComponent(role)}`,
        "DELETE"
    );
