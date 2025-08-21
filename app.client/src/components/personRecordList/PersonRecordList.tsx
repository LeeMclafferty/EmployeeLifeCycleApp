import { type PersonRecord } from "../../types/PersonRecordType";
import {
    getDisplayName,
    formatPhase,
    formatRemote,
} from "../../helpers/formattingHelpers";
import "./PersonRecordList.css";
import { useCallback, useEffect, useState } from "react";

type Props = { personRecords: PersonRecord[]; filter?: string };

const PersonRecordList = ({ personRecords, filter }: Props) => {
    const [filteredRecords, setFilteredRecords] =
        useState<PersonRecord[]>(personRecords);

    const filterPersonRecords = useCallback(() => {
        if (!filter || filter.length === 0) {
            setFilteredRecords(personRecords);
        } else {
            const normalize = (s: string) =>
                s.toLowerCase().replace(/\s+/g, "");

            const buffer = personRecords.filter((record) =>
                Object.entries(record).some(([key, value]) => {
                    if (value === null || value === undefined) return false;

                    let strValue = value.toString();

                    if (key === "phase") {
                        strValue = formatPhase(value as number);
                    }

                    if (key.toLowerCase() === "isfullyremote") {
                        strValue = formatRemote(value as boolean);
                    }

                    return normalize(strValue).includes(normalize(filter));
                })
            );

            setFilteredRecords(buffer);
        }
    }, [personRecords, filter]);

    useEffect(() => {
        filterPersonRecords();
    }, [personRecords, filter, filterPersonRecords]);

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
                        {filteredRecords.map((person, i) => (
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
                                                ? formatRemote(
                                                      person.isFullyRemote
                                                  )
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
