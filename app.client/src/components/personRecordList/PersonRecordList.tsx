import { useEffect, useState } from "react";
import { getPersonRecords } from "../../api/personRecordApi";
import type { PersonRecord } from "../../types/PersonRecord";
import { getDisplayName } from "../../helpers/formattingHelpers";

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

    /*const formatPersonData = (people: PersonRecord[]) => {
        return people.map(person => ({
            ...person,
            startDate: person.startDate ? new Date(person.startDate).toLocaleDateString() : "",
            endDate: person.endDate ? new Date(person.endDate).toLocaleDateString() : "",
            isFullyRemote: person.isFullyRemote ? "Remote" : "In Office"
        }));
    }*/

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US"); // MM/DD/YYYY
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
                    {personRecords.map((person, i) => (
                        <tr key={i}>
                            <td>
                                <a href={`/viewperson/${person.id}`}>
                                    {getDisplayName(person)}
                                </a>
                            </td>
                            {Object.keys(person)
                                .filter((key) => !key.toLowerCase().includes("name") && key != "id")
                                .map((key) => (
                                <td key={key}>
                                    {
                                        key === "startDate" || key === "endDate"
                                            ? formatDate(person[key as keyof typeof person] as string)
                                            : key === "isFullyRemote"
                                                ? person.isFullyRemote ? "Remote" : "In Office"
                                                : person[key as keyof typeof person]?.toString()

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