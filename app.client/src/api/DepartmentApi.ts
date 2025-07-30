import { type Department } from "../types/DepartmentType";
import { apiRequest } from "./ApiClient";

export const getDepartmentById = (id: number) =>
    apiRequest<Department>(`Department/Get/${id}`);

export const getDepartments = () => apiRequest<Department[]>(`Department/Get`);
