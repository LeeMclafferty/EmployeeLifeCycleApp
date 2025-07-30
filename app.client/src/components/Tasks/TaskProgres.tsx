import { type AssignedTask } from "../../types/TaskDataTypes";
import "./TaskList.css";

type Props = {
    assignedTasks: AssignedTask[];
};
const TaskProgress = ({ assignedTasks }: Props) => {
    const completed = assignedTasks.filter((t) => t.isComplete).length;
    const total = assignedTasks.length;

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
                <label>
                    {total > 0
                        ? `${Math.round((completed / total) * 100)}%`
                        : "0%"}
                </label>
            </div>
        </>
    );
};

export default TaskProgress;
