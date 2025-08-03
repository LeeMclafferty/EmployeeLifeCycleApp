import { useNavigate } from "react-router-dom";
import { updatePersonRecord } from "../../api/personRecordApi";
import { type PersonRecord } from "../../types/PersonRecordType";
import { getDepartments } from "../../api/DepartmentApi";
import { useEffect, useState } from "react";
import { type Department } from "../../types/DepartmentType";
import { type Team } from "../../types/TeamType";
import { getTeams } from "../../api/TeamApi";

type Props = {
    person: PersonRecord;
};

const EditPersonRecordForm = ({ person }: Props) => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
        person.departmentId
    );
    const [selectedTeam, setSelectedTeam] = useState<number | null>(
        person.teamId
    );

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        fetchTeams();
    }, [selectedDepartment]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = document.getElementById(
            "EditPersonForm"
        ) as HTMLFormElement;
        const formData: PersonRecord = collectFormData(form);
        await updatePersonRecord(formData)
            .then(() => {
                navigate(`/Person/Read/${person.id}`);
            })
            .catch((err) => {
                console.log("Error while saving edits:", err);
            });
    };

    const collectFormData = (form: HTMLFormElement) => {
        const deskRaw: string = (
            form.elements.namedItem("DeskNumber") as HTMLInputElement
        )?.value;

        const formPerson: PersonRecord = {
            id: person.id,
            firstName: (
                form.elements.namedItem("FirstName") as HTMLInputElement
            )?.value,
            middleName: (
                form.elements.namedItem("MiddleName") as HTMLInputElement
            )?.value,
            lastName: (form.elements.namedItem("LastName") as HTMLInputElement)
                ?.value,
            preferredName: (
                form.elements.namedItem("PreferredName") as HTMLInputElement
            )?.value,
            initials: (form.elements.namedItem("Initials") as HTMLInputElement)
                ?.value,
            startDate: (
                form.elements.namedItem("StartDate") as HTMLInputElement
            )?.value,
            endDate: null,
            phoneNumber: (
                form.elements.namedItem("PhoneNumber") as HTMLInputElement
            )?.value,
            deskNumber: deskRaw === "" ? null : Number(deskRaw),
            emailAddress: (
                form.elements.namedItem("EmailAddress") as HTMLInputElement
            )?.value,
            isFullyRemote: (
                form.elements.namedItem("FullyRemote") as HTMLInputElement
            )?.checked,
            jobTitle: (form.elements.namedItem("JobTitle") as HTMLInputElement)
                ?.value,
            jobLevel: (form.elements.namedItem("JobLevel") as HTMLInputElement)
                ?.value,
            department: (() => {
                const raw = (
                    form.elements.namedItem("Department") as HTMLSelectElement
                )?.value;
                if (raw === "") return null;
                const depId = Number(raw);
                return departments.find((d) => d.id === depId) ?? null;
            })(),
            departmentId: (() => {
                const raw = (
                    form.elements.namedItem("Department") as HTMLSelectElement
                )?.value;
                return raw === "" ? null : Number(raw);
            })(),

            team: (() => {
                const raw = (
                    form.elements.namedItem("Team") as HTMLSelectElement
                )?.value;
                if (raw === "") return null;
                const teamId = Number(raw);
                return teams.find((t) => t.id === teamId) ?? null;
            })(),
            teamId: (() => {
                const raw = (
                    form.elements.namedItem("Team") as HTMLSelectElement
                )?.value;
                return raw === "" ? null : Number(raw);
            })(),
            phase: person.phase, // need to finsih this so I can update the phase from this page.
        };

        return formPerson;
    };

    const fetchDepartments = async () => {
        try {
            const deps = await getDepartments();
            setDepartments(deps);
        } catch (err) {
            console.error("Failed to load departments:", err);
        }
    };

    const fetchTeams = async () => {
        try {
            const allTeams = await getTeams();
            const filtered = allTeams.filter(
                (t) => t.departmentId === selectedDepartment
            );

            setTeams(filtered);
        } catch (err) {
            console.error("Failed to load teams:", err);
        }
    };

    return (
        <form id="EditPersonForm" onSubmit={handleSubmit}>
            <label>
                First Name:
                <input
                    type="text"
                    name="FirstName"
                    defaultValue={person.firstName || ""}
                />
            </label>
            <label>
                Middle Name:
                <input
                    type="text"
                    name="MiddleName"
                    defaultValue={person.middleName || ""}
                />
            </label>
            <label>
                Last Name:
                <input
                    type="text"
                    name="LastName"
                    defaultValue={person.lastName || ""}
                />
            </label>
            <label>
                Preferred Name:
                <input
                    type="text"
                    name="PreferredName"
                    defaultValue={person.preferredName || ""}
                />
            </label>
            <label>
                initials:
                <input
                    type="text"
                    name="Initials"
                    defaultValue={person.initials || ""}
                />
            </label>
            <label>
                Start Date:
                <input
                    type="date"
                    name="StartDate"
                    defaultValue={
                        person.startDate
                            ? person.startDate.split("T")[0] // or manually slice or regex if needed
                            : ""
                    }
                />
            </label>
            <label>
                Email:
                <input
                    type="email"
                    name="EmailAddress"
                    defaultValue={person.emailAddress || ""}
                />
            </label>
            <label>
                Phone Number:
                <input
                    type="text"
                    name="PhoneNumber"
                    defaultValue={person.phoneNumber || ""}
                />
            </label>
            <label>
                Desk Number:
                <input
                    type="number"
                    name="DeskNumber"
                    defaultValue={person.deskNumber || ""}
                />
            </label>
            <label>
                Fully Remote:
                <input
                    type="checkbox"
                    name="FullyRemote"
                    defaultChecked={person.isFullyRemote}
                />
            </label>
            <label>
                Job Title:
                <input
                    type="text"
                    name="JobTitle"
                    defaultValue={person.jobTitle || ""}
                />
            </label>
            <label>
                Job Level:
                <input
                    type="text"
                    name="JobLevel"
                    defaultValue={person.jobLevel || ""}
                />
            </label>
            <label>
                Department:
                <select
                    name="Department"
                    onChange={(e) =>
                        setSelectedDepartment(Number(e.target.value))
                    }
                >
                    {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.displayName}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Team:
                <select
                    name="Team"
                    value={selectedTeam ?? ""}
                    onChange={(e) => setSelectedTeam(Number(e.target.value))}
                >
                    <option value="">N/A</option>
                    {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                    ))}
                </select>
            </label>
            <input type="submit" defaultValue="submit"></input>
        </form>
    );
};

export default EditPersonRecordForm;
