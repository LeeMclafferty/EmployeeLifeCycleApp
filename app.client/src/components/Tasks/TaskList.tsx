import { useEffect, useState } from "react";
import { type PersonRecord } from "../../types/PersonRecordType";
import { type AssignedTask } from "../../types/TaskDataTypes";
import {
    getAssignedTaskByNewHireId,
    updateAssignedTask,
} from "../../api/TaskApi";
import "./Tasklist.css";
import TaskProgress from "./TaskProgres";

// 5 of 8 completed
// progress bar
// [] Task 1
// [] Task 2
// ...

type Props = {
    personRecord: PersonRecord;
};

const TaskList = ({ personRecord }: Props) => {
    const [assignedTask, setAssignedTask] = useState<AssignedTask[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!personRecord.id) {
                console.log("Unable to load tasks, id is null");
                return;
            }

            try {
                const data = await getAssignedTaskByNewHireId(personRecord.id);
                setAssignedTask(data);
            } catch (err) {
                console.error("Failed to load tasks:", err);
            }
        };

        fetchTasks();
    }, [personRecord.id, assignedTask]);

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
            <TaskProgress assignedTask={assignedTask} />
            <ul>
                {assignedTask.map((task) => (
                    <li key={task.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={task.isComplete}
                                onChange={(event) =>
                                    onTaskCheckboxChange(event, task)
                                }
                            />
                            <span>{task.taskTemplate?.title}</span>
                        </label>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default TaskList;
