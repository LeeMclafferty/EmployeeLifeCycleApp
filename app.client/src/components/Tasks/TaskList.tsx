import { useEffect, useState } from "react";
import {
    LifeCyclePhase,
    type PersonRecord,
} from "../../types/PersonRecordType";
import { type AssignedTask } from "../../types/TaskDataTypes";
import {
    getAssignedTaskByNewHireId,
    updateAssignedTask,
} from "../../api/TaskApi";
import "./Tasklist.css";
import TaskProgress from "./TaskProgres";
import PersonRecordSelector from "../PersonRecordSelector/PersonRecordSelector";
import { type Department } from "../../types/DepartmentType";
import { getDepartments } from "../../api/DepartmentApi";
import { type Team } from "../../types/TeamType";
import { getTeams } from "../../api/TeamApi";

// 5 of 8 completed
// progress bar
// [] Task 1
// [] Task 2
// ...

type Props = {
    personRecord: PersonRecord;
};

const TaskList = ({ personRecord }: Props) => {
    const [assignedTasks, setAssignedTask] = useState<AssignedTask[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedDept, setSelectedDept] = useState<number | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!personRecord.id) return;

            try {
                const tasks = await getAssignedTaskByNewHireId(personRecord.id);
                setAssignedTask(tasks);
                await fetchDepartments(tasks);

                // Check if current filters still apply
                const deptIds = tasks.map(
                    (t) => t.taskTemplate?.owningDepartmentId
                );
                if (selectedDept && !deptIds.includes(selectedDept)) {
                    setSelectedDept(null); // reset department
                    setSelectedTeam(null); // reset team as well
                }

                const teamIds = tasks.map((t) => t.taskTemplate?.owningTeamId);
                if (selectedTeam && !teamIds.includes(selectedTeam)) {
                    setSelectedTeam(null); // reset only team filter
                }
            } catch (err) {
                console.error("Failed to load tasks:", err);
            }
        };

        const fetchDepartments = async (tasks: AssignedTask[]) => {
            try {
                const deps = await getDepartments();
                const taskDeptIds = tasks.map(
                    (t) => t.taskTemplate.owningDepartmentId
                );
                setDepartments(deps.filter((d) => taskDeptIds.includes(d.id)));
            } catch (err) {
                console.error("Failed to load departments:", err);
            }
        };

        fetchTasks();
    }, [personRecord.id]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const allTeams = await getTeams();

                // Extract team IDs from tasks where department matches selectedDept
                const taskTeamIds = assignedTasks
                    .filter(
                        (t) =>
                            !selectedDept ||
                            t.taskTemplate?.owningDepartmentId === selectedDept
                    )
                    .map((t) => t.taskTemplate?.owningTeamId)
                    .filter(
                        (id): id is number => id !== null && id !== undefined
                    );

                // Filter teams to only those referenced by tasks (under the selected dept)
                const filtered = allTeams.filter((team) =>
                    taskTeamIds.includes(team.id)
                );

                setTeams(filtered);
            } catch (err) {
                console.error("Failed to load teams:", err);
            }
        };

        fetchTeams();
    }, [selectedDept, assignedTasks]); // re-run when dept or tasks change

    const onTaskCheckboxChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
        task: AssignedTask
    ) => {
        const isChecked = event.target.checked;
        const updated = { ...task, isComplete: isChecked };
        try {
            await updateAssignedTask(updated);
            setAssignedTask((prev) =>
                prev.map((t) => (t.id === updated.id ? updated : t))
            );
        } catch (err) {
            console.log(
                `Error attempting to change a tasks completed value: ${task.taskTemplate?.title}`,
                err
            );
        }
    };

    return (
        <>
            <div id="task-filters">
                <select
                    className="filter-options"
                    onChange={(e) => setSelectedDept(Number(e.target.value))}
                >
                    <option value="">All Departments</option>
                    {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.displayName}
                        </option>
                    ))}
                </select>
                <select
                    className="filter-options"
                    onChange={(e) => setSelectedTeam(Number(e.target.value))}
                >
                    <option value="">All Teams</option>
                    {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="task-layout">
                <div className="person-list">
                    <PersonRecordSelector
                        person={personRecord}
                        phase={LifeCyclePhase.Onboarding}
                    />
                </div>
                <div className="task-list">
                    <TaskProgress assignedTasks={assignedTasks} />
                    <div className="task-scroll">
                        <ul>
                            {assignedTasks
                                .filter(
                                    (task) =>
                                        (!selectedDept ||
                                            task.taskTemplate
                                                ?.owningDepartmentId ===
                                                selectedDept) &&
                                        (!selectedTeam ||
                                            task.taskTemplate?.owningTeamId ===
                                                selectedTeam)
                                )
                                .map((task) => (
                                    <li key={task.id}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={task.isComplete}
                                                onChange={(event) =>
                                                    onTaskCheckboxChange(
                                                        event,
                                                        task
                                                    )
                                                }
                                            />
                                            <span>
                                                {task.taskTemplate?.title}
                                            </span>
                                        </label>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TaskList;
