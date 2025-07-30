import React, { useEffect, useRef, useState } from "react";
import { type Department } from "../../types/DepartmentType";
import { type Team } from "../../types/TeamType";
import { getDepartments } from "../../api/DepartmentApi";
import { getTeams } from "../../api/TeamApi";
import "./CreateTaskForm.css";
import { type CreateTaskTemplateRequest } from "../../types/TaskDataTypes";
import { createTaskTemplate } from "../../api/TaskApi";

const CreateTaskForm = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedDepartmentId, setSelectedDeptId] = useState<number>();

    // single state object for request
    const [request, setRequest] = useState<CreateTaskTemplateRequest>({
        taskTemplate: {
            title: "",
            description: "",
            isAutomated: false,
            applicableDepartments: [],
            taskPhase: 0,
            owningTeamId: null,
            owningDepartmentId: null,
        },
        departmentIds: [],
    });

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        getDepartments().then(setDepartments);
        getTeams().then(setTeams);
    }, []);

    // updates any simple input
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setRequest((prev) => ({
            ...prev,
            taskTemplate: {
                ...prev.taskTemplate,
                [name]:
                    name === "taskPhase" || name.endsWith("Id")
                        ? Number(value)
                        : value,
            },
        }));
    };

    // tracks department checkboxes
    const handleApplicableChecked = (
        e: React.ChangeEvent<HTMLInputElement>,
        dept: Department
    ) => {
        setRequest((prev) => {
            const updated = e.target.checked
                ? [...prev.departmentIds, dept.id]
                : prev.departmentIds.filter((id) => id !== dept.id);
            return { ...prev, departmentIds: updated };
        });
    };

    // filters teams by department
    const filterTeams = () =>
        teams.filter((t) => t.departmentId === selectedDepartmentId);

    // department dropdown also updates request
    const handleDepartmentChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const deptId = Number(e.target.value);
        setSelectedDeptId(deptId);
        setRequest((prev) => ({
            ...prev,
            taskTemplate: { ...prev.taskTemplate, owningDepartmentId: deptId },
        }));
    };

    // submit form
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createTaskTemplate(request)
            .then((res) => console.log("Created:", res))
            .then(() => formRef.current?.reset())
            .catch((err) => console.error("Error:", err));
    };

    // clear button
    const onClickClear = () => {
        formRef.current?.reset();
    };

    return (
        <form id="create-task-form" onSubmit={onSubmit} ref={formRef}>
            <div id="cards-container">
                <div className="card" id="info">
                    <label>
                        Task Title:
                        <input
                            type="text"
                            name="title"
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            rows={1}
                            cols={60}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div className="row">
                    <div className="card" id="responsible">
                        <label>
                            Responsible Department:
                            <select
                                name="owningDepartmentId"
                                onChange={handleDepartmentChange}
                            >
                                <option value="">
                                    -- Select Department --
                                </option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.displayName}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Responsible Team:
                            <select name="owningTeamId" onChange={handleChange}>
                                <option value="">-- Select Team --</option>
                                {filterTeams().map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="card" id="applicable">
                        <label>Applies To Users In:</label>
                        <ul>
                            {departments.map((d) => (
                                <li key={d.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            onChange={(e) =>
                                                handleApplicableChecked(e, d)
                                            }
                                        />
                                        {d.displayName}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="card" id="phase">
                        <label>
                            Task Phase:
                            <select name="taskPhase" onChange={handleChange}>
                                <option value={0}>Onboarding</option>
                                <option value={1}>Offboarding</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>

            <button id="clear-btn" type="button" onClick={onClickClear}>
                Clear
            </button>
            <input type="submit" value="Submit" />
        </form>
    );
};

export default CreateTaskForm;
