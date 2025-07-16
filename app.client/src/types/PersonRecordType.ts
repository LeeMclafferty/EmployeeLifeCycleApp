// This type should mirror PersonRecord on backend

export enum LifeCyclePhase {
    Draft, // 1. Recruiter-only stage
    Onboarding, // 2. Public stage; tasks begin
    Active, // 3. Fully employed
    Offboarded, // 4. No longer at the company
}

export type PersonRecord = {
    id?: number;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    preferredName: string | null;
    initials: string | null;
    startDate: string | null;
    endDate: string | null;
    phoneNumber: string | null;
    deskNumber: number | null;
    emailAddress: string | null;
    isFullyRemote: boolean;
    jobTitle: string | null;
    jobLevel: string | null;
    department: string | null;
    phase: LifeCyclePhase.Draft;
};
