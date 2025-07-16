import { type AssignedTask } from "../../types/TaskDataTypes";
import "./TaskList.css";

type Props = {
    assignedTask: AssignedTask[];
};
const TaskProgress = ({ assignedTask }: Props) => {
    const completed = assignedTask.filter((t) => t.isComplete).length;
    const total = assignedTask.length;

    return (
        <>
            <label id="progress-text">{`${completed} of ${total} completed`}</label>
            <div id="progress-bar">
                <meter
                    id="task-progress"
                    value={completed}
                    min="0"
                    max={total}
                />
            </div>
        </>
    );
};

export default TaskProgress;
