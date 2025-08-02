import PersonRecordList from "../components/personRecordList/PersonRecordList";
import ProgressCircle from "../components/ProgressCircle/ProgressCircle";
import PieChart from "../components/PieChart/PieChart.tsx";
import "./pageCSS/pages.css";
import "./pageCSS/DashboardPage.css";
import { useEffect, useState } from "react";
import { getAssignedTask } from "../api/TaskApi";
import { type AssignedTask, TaskPhase } from "../types/TaskDataTypes.ts";
import { LifeCyclePhase, type PersonRecord } from "../types/PersonRecordType";
import { getPersonRecords } from "../api/PersonRecordApi";

// Pie chart: number of employees per status
// Progress circle: % completion of current employees being onboarded.
const DashboardPage = () => {
    const [completion, setCompletion] = useState(0);
    const [personRecords, setPersonRecords] = useState<PersonRecord[]>([]);

    const calculateOnboardingCompletion = async () => {
        try {
            const assignedTasks: AssignedTask[] = await getAssignedTask();
            if (!assignedTasks) return 0;

            let totalTasks = 0;
            let completedTasks = 0;

            for (const task of assignedTasks) {
                if (!task.taskTemplate) continue;
                if (task.taskTemplate.taskPhase !== TaskPhase.Onboarding)
                    continue;

                totalTasks++;
                if (task.isComplete) completedTasks++;
            }

            return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        } catch (err) {
            console.error("Error calculating onboarding completion:", err);
            return 0;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const records = await getPersonRecords();
                setPersonRecords(records);

                const percent = await calculateOnboardingCompletion();
                setCompletion(percent);
            } catch (err) {
                console.error("Error loading dashboard data:", err);
            }
        };
        fetchData();
    }, []);

    const phaseCounts = personRecords.reduce((acc, person) => {
        const phaseKey = Number(person.phase); // ✅ ensure numeric
        acc[phaseKey] = (acc[phaseKey] || 0) + 1;
        console.log(acc);
        return acc;
    }, {} as Record<number, number>);

    return (
        <>
            <h1>Dashboard Page</h1>
            <h4>An overview of all users and tasks</h4>
            <div className="graphs">
                <div className="card graph-card">
                    <ProgressCircle value={completion} />
                    <div className="card-text">
                        <div className="stat-number">
                            {Math.ceil(completion)}%
                        </div>
                        <div className="stat-text">Onboarding Completion</div>
                    </div>
                </div>
                <div className="card graph-card">
                    <PieChart
                        data={[
                            {
                                value:
                                    phaseCounts[Number(LifeCyclePhase.Draft)] ??
                                    0,
                                color: "#007bff",
                            },
                            {
                                value:
                                    phaseCounts[
                                        Number(LifeCyclePhase.Onboarding)
                                    ] ?? 0,
                                color: "#00ff95",
                            },
                            {
                                value:
                                    phaseCounts[
                                        Number(LifeCyclePhase.Active)
                                    ] ?? 0,
                                color: "#fbff00",
                            },
                            {
                                value:
                                    phaseCounts[
                                        Number(LifeCyclePhase.Offboarded)
                                    ] ?? 0,
                                color: "#ff0000",
                            },
                        ]}
                    />
                </div>
            </div>

            <PersonRecordList />
        </>
    );
};

export default DashboardPage;
