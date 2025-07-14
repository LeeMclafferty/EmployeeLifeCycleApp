import { type AssignedTask } from "../../types/TaskDataTypes";

type Props = {
    assignedTask: AssignedTask[];
};
const TaskProgress = ({ assignedTask }: Props) => {
    const completed = assignedTask.filter((t) => t.isComplete).length;
    const total = assignedTask.length;

    return (
        <>
            <label>{`${completed} of ${total} completed`}</label>
            <div>
                <meter
                    id="taskProgress"
                    value={completed}
                    min="0"
                    max={total}
                />
            </div>
        </>
    );
};

export default TaskProgress;
