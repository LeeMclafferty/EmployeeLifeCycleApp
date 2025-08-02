import PersonRecordList from "../components/personRecordList/PersonRecordList";
import ProgressCircle from "../components/ProgressCircle/ProgressCircle";
import PieChart from "../components/PieChart/PieChart.tsx";
import "./pageCSS/pages.css";
import "./pageCSS/DashboardPage.css";
import { useEffect, useState } from "react";
import { getAssignedTask } from "../api/TaskApi";
import { type AssignedTask, TaskPhase } from "../types/TaskDataTypes.ts";

// Pie chart show number of employees per status
// progress circle show % completion of current employees being onboarded.
const DashboardPage = () => {
    const [completion, setCompletion] = useState(0);

    useEffect(() => {
        const fetchCompletion = async () => {
            const percent = await calculateOnboardingCompletion();
            setCompletion(percent);
        };
        fetchCompletion();
    }, []);

    const calculateOnboardingCompletion = async () => {
        const assignedTasks: AssignedTask[] = await getAssignedTask();
        if (!assignedTasks) return 0;
        let totalTasks = 0;
        let completedTasks = 0;

        for (let i = 0; i < assignedTasks.length; i++) {
            const task: AssignedTask = assignedTasks[i];

            if (!task.taskTemplate) continue;

            console.log(task.taskTemplate.title);

            if (
                (task.taskTemplate.taskPhase as TaskPhase) !==
                TaskPhase.Onboarding
            )
                continue;

            totalTasks++;
            if (task.isComplete) completedTasks++;
        }

        return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    };

    return (
        <>
            <h1>Dashboard Page</h1>
            <h4>An overview of all users and tasks</h4>
            <div className="graphs">
                <div className="card graph-card">
                    <ProgressCircle value={completion} />
                </div>
                <div className="card graph-card">
                    <PieChart
                        data={[
                            { value: 40, color: "#007bff" },
                            { value: 30, color: "#28a745" },
                            { value: 20, color: "#ff4d07ff" },
                            { value: 10, color: "#e6e6e6" },
                        ]}
                    />
                </div>
            </div>

            <PersonRecordList />
        </>
    );
};

export default DashboardPage;
