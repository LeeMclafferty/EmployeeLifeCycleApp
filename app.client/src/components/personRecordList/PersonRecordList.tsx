import { useEffect, useState } from "react";
import { getPersonRecords } from "../../api/PersonRecordApi";
import { type PersonRecord } from "../../types/PersonRecordType";
import { getDisplayName, formatPhase } from "../../helpers/formattingHelpers";

const PersonRecordList = () => {
    const [personRecords, setPersonRecords] = useState<PersonRecord[]>([]);
    useEffect(() => {
        getPersonRecords().then((data) => {
            setPersonRecords(data);
        });
    }, []);

    const formatHeader = (header: string) => {
        const spacedString = header.replace(/([a-z])([A-Z])/g, "$1 $2");
        const slicedFirstChar = spacedString.slice(1);
        const firstChar = spacedString.charAt(0).toUpperCase();

        return firstChar + slicedFirstChar;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US"); // MM/DD/YYYY
    };

    return (
        <>
            {personRecords.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th key="displayName">Display Name</th>
                            {Object.keys(personRecords[0])
                                .filter(
                                    (key) =>
                                        !key.toLowerCase().includes("name") &&
                                        key !== "id" &&
                                        key !== "departmentId" &&
                                        key !== "teamId" &&
                                        key !== "department" &&
                                        key !== "team"
                                )
                                .map((key) => (
                                    <th key={key}>{formatHeader(key)}</th>
                                ))}
                            <th key="department">Department</th>
                            <th key="team">Team</th>
                        </tr>
                    </thead>

                    <tbody>
                        {personRecords.map((person, i) => (
                            <tr key={i}>
                                <td>
                                    <a href={`/Person/Read/${person.id}`}>
                                        {getDisplayName(person)}
                                    </a>
                                </td>
                                {Object.keys(person)
                                    .filter(
                                        (key) =>
                                            !key
                                                .toLowerCase()
                                                .includes("name") &&
                                            key !== "id" &&
                                            key !== "departmentId" &&
                                            key !== "teamId" &&
                                            key !== "department" &&
                                            key !== "team"
                                    )
                                    .map((key) => (
                                        <td key={key}>
                                            {key === "startDate" ||
                                            key === "endDate"
                                                ? formatDate(
                                                      person[
                                                          key as keyof typeof person
                                                      ] as string
                                                  )
                                                : key === "isFullyRemote"
                                                ? person.isFullyRemote
                                                    ? "Remote"
                                                    : "In Office"
                                                : key === "phase"
                                                ? formatPhase(person.phase)
                                                : person[
                                                      key as keyof typeof person
                                                  ]?.toString()}
                                        </td>
                                    ))}
                                <td>{person.department?.displayName ?? ""}</td>
                                <td>{person.team?.name ?? ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

export default PersonRecordList;
