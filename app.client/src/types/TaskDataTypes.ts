import { type Department } from "./DepartmentType";
import { type Team } from "./TeamType";
export enum TaskPhase {
    Onboarding,
    Offboarding,
}

export type TaskTemplate = {
    id?: number;
    title: string;
    description: string | null;
    isAutomated: boolean;
    applicableDepartments: Department[];
    taskPhase: TaskPhase;

    owningTeamId: number | null;
    owningTeam?: Team | null;

    owningDepartmentId: number | null;
    owningDepartment?: Department | null;
};

export type AssignedTask = {
    id: number;
    taskTemplateId: number;
    newHireId: number;
    isComplete: boolean;
    completedAt: string;
    notes: string;
    taskTemplate: TaskTemplate;
};

export type CreateTaskTemplateRequest = {
    taskTemplate: TaskTemplate;
    departmentIds: number[];
};
