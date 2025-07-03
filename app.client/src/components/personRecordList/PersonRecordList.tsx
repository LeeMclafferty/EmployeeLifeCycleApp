import { useEffect, useState } from "react";
import { getPersonRecords } from "../../api/personRecordApi";
import type { PersonRecord } from "../../types/PersonRecord";

const PersonRecordList = () => {
    const [personRecords, setPersonRecords] = useState<PersonRecord[]>([]);
    useEffect(() => {
        getPersonRecords()
            .then(data => {
                setPersonRecords(data)
            });
    }, []);

    const formatHeader = (header: string) => {
        const spacedString = header.replace(/([a-z])([A-Z])/g, '$1 $2');
        const slicedFirstChar = spacedString.slice(1);
        const firstChar = spacedString.charAt(0).toUpperCase();

        return firstChar + slicedFirstChar;;
    }

    const formatPersonData = (people: PersonRecord[]) => {
        return people.map(person => ({
            ...person,
            startDate: person.startDate ? new Date(person.startDate).toLocaleDateString() : "",
            endDate: person.endDate ? new Date(person.endDate).toLocaleDateString() : "",
            isFullyRemote: person.isFullyRemote ? "Remote" : "In Office"
        }));
    }

    const getDisplayName = (person: any): string => {
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


    return (
        <>
        {
            personRecords.length > 0 &&
            <table>
                <thead>
                    <tr>
                        <th key="displayName">Display Name</th>
                        {
                            Object.keys(personRecords[0])
                                .filter((key) => !key.toLowerCase().includes("name") && key != "id")
                                .map((key) => (
                                <th key={key}>{formatHeader(key)}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {formatPersonData(personRecords).map((person, i) => (
                        <tr key={i}>
                            <td>
                                <a href={`/editperson/${person.id}`}>
                                    {getDisplayName(person)}
                                </a>
                            </td>
                            {Object.keys(person)
                                .filter((key) => !key.toLowerCase().includes("name") && key != "id")
                                .map((key) => (
                                <td key={key}>
                                    {
                                        person[key as keyof typeof person]?.toString()
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>

            </table>
        }
        </>
  );
}

export default PersonRecordList;