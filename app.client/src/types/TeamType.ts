import { type Department } from "./DepartmentType";
export type Team = {
    id: number;
    name: string;

    departmentId: number;
    Department: Department;
};
