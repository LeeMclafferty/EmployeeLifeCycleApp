
// This type should mirror PersonRecord on backend
export type PersonRecord = {
    id?: number,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
    preferredName: string | null,
    initials: string | null,
    startDate: Date | null,
    endDate: Date | null,
    phoneNumber: string | null,
    deskNumber: number | null,
    emailAddress: string | null,
    isFullyRemote: boolean,
    jobTitle: string | null,
    jobLevel: string | null,
    department: string | null
}