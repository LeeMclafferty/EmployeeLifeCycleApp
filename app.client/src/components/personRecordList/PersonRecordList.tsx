import { useEffect, useState } from "react";
import { getPersonRecords } from "../../api/PersonRecordApi";
import { type PersonRecord } from "../../types/PersonRecordType";
import { getDisplayName, formatPhase } from "../../helpers/formattingHelpers";
import "./PersonRecordList.css";

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
        <div className="card shadow-sm">
            {personRecords.length > 0 && (
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Display Name</th>
                            {/* Dynamically render other headers */}
                            {Object.keys(personRecords[0])
                                .filter(
                                    (key) =>
                                        ![
                                            "id",
                                            "departmentid",
                                            "teamid",
                                            "department",
                                            "team",
                                        ].includes(key.toLowerCase()) &&
                                        !key.toLowerCase().includes("name")
                                )

                                .map((key) => (
                                    <th key={key}>{formatHeader(key)}</th>
                                ))}
                            <th>Department</th>
                            <th>Team</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personRecords.map((person, i) => (
                            <tr key={i}>
                                <td>
                                    <a
                                        href={`/Person/Read/${person.id}`}
                                        className="text-primary fw-medium"
                                    >
                                        {getDisplayName(person)}
                                    </a>
                                </td>
                                {Object.keys(person)
                                    .filter(
                                        (key) =>
                                            ![
                                                "id",
                                                "departmentid",
                                                "teamid",
                                                "department",
                                                "team",
                                            ].includes(key.toLowerCase()) &&
                                            !key.toLowerCase().includes("name")
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
                                                : key === "phase"
                                                ? formatPhase(
                                                      person[
                                                          key as keyof typeof person
                                                      ] as number
                                                  )
                                                : key === "isFullyRemote"
                                                ? person.isFullyRemote
                                                    ? "Remote"
                                                    : "In Office"
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
        </div>
    );
};

export default PersonRecordList;
