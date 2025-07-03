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

    const getDisplayName = (person: any) => {
        let first: string = "";
        let last: string = "";
        if (person.preferredName) {
            // if preferredName has spaces, hinting at first and last name.
            if (person.preferredName.includes(" ")) {
                const names = person.preferredName.split(" ");
                if (names) {
                    first = names[0];
                    for (let i = 1; i < names.length; i++) {
                        if (i == 1) {
                            last += names[i];
                            continue;
                        }
                        last += (" " + names[i]);
                    }
                    return first + " " + last;
                }
            }
            else {
                return person.preferredName + " " + person.lastName;
            }
        } else {
            return person.firstName + " " + person.lastName;
        }
    }

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