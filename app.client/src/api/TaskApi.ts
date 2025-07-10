import { AssignedTask, TaskTemplate } from "../types/Task";
import { apiRequest } from "./ApiClient";

export const getTaskTemplates = () =>
    apiRequest<TaskTemplate[]>("TaskTemplate/Get");

export const getAssignedTask = () =>
    apiRequest<AssignedTask[]>("AssignedTask/Get");

export const getTaskTemplateById = (id: number) =>
    apiRequest<TaskTemplate>(`TaskTemplate/Get/${id}`);

export const getAssignedTaskById = (id: number) =>
    apiRequest<AssignedTask>(`AssignedTask/Get/${id}`);

export const updateTaskTemplate = (data: TaskTemplate) =>
    apiRequest<TaskTemplate, TaskTemplate>("TaskTemplate/Update", "PUT", data);

export const updateAssignedTask = (data: AssignedTask) =>
    apiRequest<AssignedTask, AssignedTask>("AssignedTask/Update", "PUT", data);

export const createTaskTemplate = (data: TaskTemplate) =>
    apiRequest<TaskTemplate, TaskTemplate>("TaskTemplate/Create", "POST", data);

export const createAssignedTask = (data: AssignedTask) =>
    apiRequest<AssignedTask, AssignedTask>("AssignedTask/Create", "POST", data);

export const getAssignedTaskByNewHireId = (id: number) =>
    apiRequest<AssignedTask[]>(`AssignedTask/ByNewHire/${id}`);
