export enum TaskPhase {
    Onboarding,
    Offboarding
}

export type TaskTemplate = {
    id: number,
    title: string,
    description: string | null,
    isAutomated: boolean,
    departmentId: number,
    taskPhase: TaskPhase
}

export type AssignedTask = {
    id: number,
    taskTemplateId: number,
    newHireId: number,
    isComplete: boolean,
    completedAt: string, // Date on the backend
    notes: string

    taskTemplate: TaskTemplate
}