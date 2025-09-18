import type React from "react";
import { createPersonRecord } from "../../api/personRecordApi";
import {
    LifeCyclePhase,
    type PersonRecord,
} from "../../types/PersonRecordType";
import { useEffect, useState } from "react";
import { getDepartments } from "../../api/DepartmentApi";
import { getTeams } from "../../api/TeamApi";
import { type Team } from "../../types/TeamType";
import { type Department } from "../../types/DepartmentType";
import { type TaskPhase } from "../../types/TaskDataTypes";

const AddPersonRecordForm = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [teams, setPersonTeams] = useState<Team[]>([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<
        number | null
    >(null);
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

    useEffect(() => {
        getDepartments().then(setDepartments);
        getTeams().then(setPersonTeams);
    }, []);

    const filterTeams = () => {
        if (!selectedDepartmentId) return [];
        return teams.filter((t) => t.departmentId === selectedDepartmentId);
    };

    const handleDepartmentChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const deptId = Number(e.target.value);
        setSelectedDepartmentId(isNaN(deptId) ? null : deptId);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = document.getElementById(
            "AddPersonForm"
        ) as HTMLFormElement;
        const formData = collectFormData(form);

        createPersonRecord(formData)
            .then(() => {
                form.reset();
                setSelectedDepartmentId(null); // reset team filter
            })
            .catch((err) => {
                console.error("Failed to submit person record:", err);
            });
    };

    const collectFormData = (form: HTMLFormElement): PersonRecord => {
        const deskRaw: string = (
            form.elements.namedItem("DeskNumber") as HTMLInputElement
        )?.value;

        const personRecord: PersonRecord = {
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
                    form.elements.namedItem("PersonTeam") as HTMLSelectElement
                )?.value;
                if (raw === "") return null;
                const teamId = Number(raw);
                return teams.find((t) => t.id === teamId) ?? null;
            })(),
            teamId: (() => {
                const raw = (
                    form.elements.namedItem("PersonTeam") as HTMLSelectElement
                )?.value;
                return raw === "" ? null : Number(raw);
            })(),
            phase: LifeCyclePhase.Draft,
        };

        return personRecord;
    };

    return (
        <form id="AddPersonForm" onSubmit={handleSubmit}>
            <label>
                First Name:
                <input type="text" name="FirstName" />
            </label>
            <label>
                Middle Name:
                <input type="text" name="MiddleName" />
            </label>
            <label>
                Last Name:
                <input type="text" name="LastName" />
            </label>
            <label>
                Preferred Name:
                <input type="text" name="PreferredName" />
            </label>
            <label>
                Initials:
                <input type="text" name="Initials" />
            </label>
            <label>
                Start Date:
                <input type="date" name="StartDate" />
            </label>
            <label>
                Email:
                <input type="email" name="EmailAddress" />
            </label>
            <label>
                Phone Number:
                <input type="text" name="PhoneNumber" />
            </label>
            <label>
                Desk Number:
                <input type="number" name="DeskNumber" />
            </label>
            <label>
                Fully Remote:
                <input type="checkbox" name="FullyRemote" />
            </label>
            <label>
                Job Title:
                <input type="text" name="JobTitle" />
            </label>
            <label>
                Job Level:
                <input type="text" name="JobLevel" />
            </label>
            <label>
                Department:
                <select name="Department" onChange={handleDepartmentChange}>
                    <option value="">-- Select Department --</option>
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
                    name="PersonTeam"
                    className="form-select"
                    value={selectedTeam ?? ""}
                    onChange={(e) => setSelectedTeam(Number(e.target.value))}
                >
                    <option value="">N/A</option>
                    {filterTeams().map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                    ))}
                </select>
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
};

export default AddPersonRecordForm;
