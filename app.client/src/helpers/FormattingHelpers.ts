import { type PersonRecord } from "../types/PersonRecordType";

// Returns the PersonRecords display name
export const getDisplayName = (person: PersonRecord): string => {
    if (person.preferredName) {
        const parts = person.preferredName.trim().split(/\s+/);

        // If preferredName is a full name
        if (parts.length > 1) {
            const first = parts[0];
            const last = parts.slice(1).join(" ");
            return `${first} ${last}`;
        }

        // If preferredName is just a first name
        return `${person.preferredName} ${person.lastName ?? ""}`;
    }

    return `${person.firstName ?? ""} ${person.lastName ?? ""}`;
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
};
