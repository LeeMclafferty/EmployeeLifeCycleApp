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
            endDate: person.startDate ? new Date(person.endDate).toLocaleDateString() : "",
            isFullyRemote: person.isFullyRemote ? "Remote" : "In Office"
        }));
    }

    return (
        <>
        {
            personRecords.length > 0 &&
            <table>
                <thead>
                    <tr>
                        {Object.keys(personRecords[0]).map((key) => (
                            <th key={key}>{formatHeader(key)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {formatPersonData(personRecords).map((person, i) => (
                        <tr key={i}>
                            {Object.keys(person).map((key) => (
                                <td key={key}>{person[key as keyof typeof person]?.toString()}</td>
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