import { useNavigate } from "react-router-dom";
import { updatePersonRecord } from "../../api/personRecordApi";
import { type PersonRecord } from "../../types/PersonRecordType";
import { getDepartments } from "../../api/DepartmentApi";
import { useEffect, useState } from "react";
import { type Department } from "../../types/DepartmentType";
import { type Team } from "../../types/TeamType";
import { getTeams } from "../../api/TeamApi";
import "./EditPersonRecordForm.css";
import "../../pages/pageCSS/pages.css";

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
        <div className="outter">
            <div className="form-container">
                <form
                    id="EditPersonForm"
                    onSubmit={handleSubmit}
                    className="container"
                >
                    {/* First Row: First, Middle, Last */}
                    <div className="card">
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    name="FirstName"
                                    defaultValue={person.firstName || ""}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">
                                    Middle Name
                                </label>
                                <input
                                    type="text"
                                    name="MiddleName"
                                    defaultValue={person.middleName || ""}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    name="LastName"
                                    defaultValue={person.lastName || ""}
                                    className="form-control"
                                />
                            </div>
                        </div>
                        {/* Second Row: Preferred Name + Initials */}
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">
                                    Preferred Name
                                </label>
                                <input
                                    type="text"
                                    name="PreferredName"
                                    defaultValue={person.preferredName || ""}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Initials</label>
                                <input
                                    type="text"
                                    name="Initials"
                                    defaultValue={person.initials || ""}
                                    className="form-control"
                                />
                            </div>
                        </div>
                        {/* Other fields... keep each in a full-width row */}
                        <div className="row g-4 mb-4">
                            <div className="col-md-4">
                                <label className="form-label">Start Date</label>
                                <input
                                    type="date"
                                    name="StartDate"
                                    defaultValue={
                                        person.startDate
                                            ? person.startDate.split("T")[0]
                                            : ""
                                    }
                                    className="form-control w-100"
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Department</label>
                            <select
                                name="Department"
                                className="form-select"
                                value={selectedDepartment ?? ""}
                                onChange={(e) =>
                                    setSelectedDepartment(
                                        Number(e.target.value)
                                    )
                                }
                            >
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.displayName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Team</label>
                            <select
                                name="Team"
                                className="form-select"
                                value={selectedTeam ?? ""}
                                onChange={(e) =>
                                    setSelectedTeam(Number(e.target.value))
                                }
                            >
                                <option value="">N/A</option>
                                {teams.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPersonRecordForm;
