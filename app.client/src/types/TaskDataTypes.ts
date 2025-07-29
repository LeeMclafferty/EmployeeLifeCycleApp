import { type Department } from "./DepartmentType";
import { type Team } from "./TeamType";
export enum TaskPhase {
    Onboarding,
    Offboarding,
}

export type TaskTemplate = {
    id: number;
    title: string;
    description: string | null;
    isAutomated: boolean;
    ApplicableDepartments: Department[];
    departmentId: number;
    taskPhase: TaskPhase;

    OwningTeamId: number | null;
    OwnerTeam: Team | null;
    OwningDepartmentId: number | null;
    OwningDepartment: Department | null;
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
