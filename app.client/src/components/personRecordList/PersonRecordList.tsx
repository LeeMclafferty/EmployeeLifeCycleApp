import { type PersonRecord } from "../../types/PersonRecordType";
import {
    getDisplayName,
    formatPhase,
    formatRemote,
} from "../../helpers/formattingHelpers";
import "./PersonRecordList.css";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "../../hooks/UseUser";

type Props = { personRecords: PersonRecord[]; filter?: string };

const PersonRecordList = ({ personRecords, filter }: Props) => {
    const [filteredRecords, setFilteredRecords] =
        useState<PersonRecord[]>(personRecords);

    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "asc" | "desc";
    } | null>(null);

    const { roles, isSuperAdmin, hasRole } = useUser();

    const columnOrder: (
        | keyof PersonRecord
        | "displayName"
        | "department"
        | "team"
    )[] = [
        "displayName",
        "department",
        "team",
        "jobTitle",
        "jobLevel",
        "emailAddress",
        "initials",
        "phoneNumber",
        "deskNumber",
        "isFullyRemote",
        "startDate",
        "endDate",
        "phase",
    ];

    const filterPersonRecords = useCallback(() => {
        let results = personRecords;

        // role filter
        if (!isSuperAdmin) {
            const allowed: string[] = [];

            if (hasRole(["OffboardingUser"])) {
                allowed.push("Offboarded");
            }

            if (hasRole(["OnboardingUser"])) {
                allowed.push("Onboarding");
            }

            if (hasRole(["OnboardingAdmin"])) {
                // all except offboarded
                allowed.push("Active", "Onboarding", "Draft");
            }

            if (hasRole(["OffboardingAdmin"])) {
                allowed.push("Active", "Offboarded");
            }

            results = results =
                allowed.length > 0
                    ? results.filter((r) =>
                          allowed.includes(formatPhase(r.phase))
                      )
                    : [];
        }

        // text search filter
        if (filter && filter.length > 0) {
            const normalize = (s: string) =>
                s.toLowerCase().replace(/\s+/g, "");
            results = results.filter((record) =>
                Object.entries(record).some(([key, value]) => {
                    if (value == null) return false;

                    let strValue = value.toString();
                    if (key === "phase")
                        strValue = formatPhase(value as number);
                    if (key.toLowerCase() === "isfullyremote")
                        strValue = formatRemote(value as boolean);

                    return normalize(strValue).includes(normalize(filter));
                })
            );
        }

        // sorting
        if (sortConfig) {
            results = [...results].sort((a, b) => {
                let aVal: string | number = "";
                let bVal: string | number = "";

                switch (sortConfig.key) {
                    case "displayName":
                        aVal = getDisplayName(a);
                        bVal = getDisplayName(b);
                        break;
                    case "department":
                        aVal = a.department?.displayName ?? "";
                        bVal = b.department?.displayName ?? "";
                        break;
                    case "team":
                        aVal = a.team?.name ?? "";
                        bVal = b.team?.name ?? "";
                        break;
                    case "phase":
                        aVal = formatPhase(a.phase);
                        bVal = formatPhase(b.phase);
                        break;
                    case "isFullyRemote":
                        aVal = formatRemote(a.isFullyRemote);
                        bVal = formatRemote(b.isFullyRemote);
                        break;
                    case "startDate":
                    case "endDate":
                        aVal = new Date(a[sortConfig.key] as string).getTime();
                        bVal = new Date(b[sortConfig.key] as string).getTime();
                        break;
                    default:
                        aVal = (
                            a[sortConfig.key as keyof PersonRecord] ?? ""
                        ).toString();
                        bVal = (
                            b[sortConfig.key as keyof PersonRecord] ?? ""
                        ).toString();
                }

                if (typeof aVal === "number" && typeof bVal === "number") {
                    return sortConfig.direction === "asc"
                        ? aVal - bVal
                        : bVal - aVal;
                }

                return sortConfig.direction === "asc"
                    ? aVal.toString().localeCompare(bVal.toString())
                    : bVal.toString().localeCompare(aVal.toString());
            });
        }

        setFilteredRecords(results);
    }, [personRecords, filter, sortConfig, hasRole, isSuperAdmin]);

    useEffect(() => {
        filterPersonRecords();
    }, [filterPersonRecords]);

    const formatHeader = (header: string) => {
        const spacedString = header.replace(/([a-z])([A-Z])/g, "$1 $2");
        return spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US");
    };

    const renderSortableHeader = (key: string, label?: string) => (
        <th
            key={key}
            onClick={() =>
                setSortConfig((prev) =>
                    prev && prev.key === key
                        ? {
                              key,
                              direction:
                                  prev.direction === "asc" ? "desc" : "asc",
                          }
                        : { key, direction: "asc" }
                )
            }
            style={{ cursor: "pointer" }}
        >
            {label ?? formatHeader(key)}
            {sortConfig?.key === key
                ? sortConfig.direction === "asc"
                    ? " ▲"
                    : " ▼"
                : null}
        </th>
    );

    return (
        <div className="card shadow-sm">
            {filteredRecords.length > 0 && (
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            {columnOrder.map((key) =>
                                renderSortableHeader(key, formatHeader(key))
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.map((person, i) => (
                            <tr key={i}>
                                {columnOrder.map((key) => (
                                    <td key={key}>
                                        {key === "displayName" ? (
                                            <a
                                                href={`/Person/Read/${person.id}`}
                                                className="text-primary fw-medium"
                                            >
                                                {getDisplayName(person)}
                                            </a>
                                        ) : key === "department" ? (
                                            person.department?.displayName ?? ""
                                        ) : key === "team" ? (
                                            person.team?.name ?? ""
                                        ) : key === "phase" ? (
                                            formatPhase(person.phase)
                                        ) : key === "isFullyRemote" ? (
                                            formatRemote(person.isFullyRemote)
                                        ) : key === "startDate" ||
                                          key === "endDate" ? (
                                            formatDate(person[key] as string)
                                        ) : (
                                            person[
                                                key as keyof PersonRecord
                                            ]?.toString() ?? ""
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PersonRecordList;
