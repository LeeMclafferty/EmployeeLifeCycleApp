import { useEffect, useState } from "react";
import { type PersonRecord } from "../../types/PersonRecordType";
import { type AssignedTask } from "../../types/TaskDataTypes";
import { getAssignedTaskByNewHireId } from "../../api/TaskApi";

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
    console.log(personRecord);
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

    return (
        <>
            <ul>
                {assignedTask.map((task) => (
                    <li key={task.id}>{task.taskTemplate?.title}</li>
                ))}
            </ul>
        </>
    );
};

export default TaskList;
