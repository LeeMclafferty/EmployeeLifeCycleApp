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
import PieLegend from "../components/PieChart/PieLegend.tsx";
import Modal from "../components/Modal/Modal.tsx";
import ChangePhaseModal from "../components/Modal/Content/ChangePhaseModal.tsx";
import { downloadExcel } from "../api/ExportApi.ts";
import { useUser } from "../hooks/UseUser.ts";

// Pie chart: number of employees per status
// Progress circle: % completion of current employees being onboarded.

const legendItems = [
    { label: "Draft", color: "#FFC154" },
    { label: "Onboarding", color: "#4778b3ff" },
    { label: "Active", color: "#47B39C" },
    { label: "Offboarded", color: "#EC6B56" },
];

const DashboardPage = () => {
    const [completion, setCompletion] = useState(0);
    const [personRecords, setPersonRecords] = useState<PersonRecord[]>([]);
    const [isPhaseChangeOpen, setIsPhaseChangeOpen] = useState<boolean>(false);
    const [listFilter, setListFilter] = useState<string>("");
    const { hasRole } = useUser();

    const canChangePhase = hasRole([
        "OnboardingAdmin",
        "OffboardingAdmin",
        "SuperAdmin",
    ]);

    const canExport = hasRole([
        "OnboardingAdmin",
        "OffboardingAdmin",
        "SuperAdmin",
    ]);

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

    const refreshPersonRecords = async () => {
        const data = await getPersonRecords();
        setPersonRecords(data);
    };

    useEffect(() => {
        const fetchData = async () => {
            await refreshPersonRecords();
            setCompletion(await calculateOnboardingCompletion());
        };
        fetchData();
    }, []);

    const phaseCounts = personRecords.reduce((acc, person) => {
        const phaseKey = Number(person.phase);
        acc[phaseKey] = (acc[phaseKey] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const closeModal = () => {
        setIsPhaseChangeOpen(false);
    };

    const exportExcelReport = () => {
        downloadExcel();
    };

    return (
        <>
            <div className="page-container">
                <div className="outter">
                    <div>
                        <h1>Dashboard Page</h1>
                        <h4>An overview of all users and tasks</h4>
                    </div>
                    <div className="graphs">
                        <div className="card graph-card">
                            <ProgressCircle value={completion} />
                            <div className="card-text">
                                <div className="stat-number">
                                    {Math.ceil(completion)}%
                                </div>
                                <div className="stat-text">
                                    Onboarding Completion
                                </div>
                            </div>
                        </div>
                        <div className="card graph-card">
                            <PieChart
                                data={[
                                    {
                                        value:
                                            phaseCounts[
                                                Number(LifeCyclePhase.Draft)
                                            ] ?? 0,
                                        color: "#FFC154",
                                    },
                                    {
                                        value:
                                            phaseCounts[
                                                Number(
                                                    LifeCyclePhase.Onboarding
                                                )
                                            ] ?? 0,
                                        color: "#4778b3ff",
                                    },
                                    {
                                        value:
                                            phaseCounts[
                                                Number(LifeCyclePhase.Active)
                                            ] ?? 0,
                                        color: "#47B39C",
                                    },
                                    {
                                        value:
                                            phaseCounts[
                                                Number(
                                                    LifeCyclePhase.Offboarded
                                                )
                                            ] ?? 0,
                                        color: "#EC6B56",
                                    },
                                ]}
                            />
                            <PieLegend items={legendItems} />
                        </div>
                        <div className="card graph-card btn-card">
                            <button
                                className={"card-btn"}
                                disabled={!canChangePhase}
                                id={
                                    canChangePhase
                                        ? "phase-btn"
                                        : "phase-btn-disabled"
                                }
                                title={
                                    !canChangePhase
                                        ? "Changing Phases is disabled for your role."
                                        : undefined
                                }
                                onClick={() => setIsPhaseChangeOpen(true)}
                            >
                                Change
                                <br />
                                Phase
                            </button>
                            <button
                                className="card-btn"
                                disabled={!canExport}
                                id={
                                    canExport
                                        ? "export-btn"
                                        : "export-btn-disabled"
                                }
                                title={
                                    !canExport
                                        ? "Exporting is disabled for your role."
                                        : undefined
                                }
                                onClick={() => exportExcelReport()}
                            >
                                Export
                                <br />
                                Data
                            </button>
                        </div>
                    </div>
                    <div id="input-div">
                        <input
                            id="list-search-input"
                            placeholder="Search"
                            onChange={(e) => setListFilter(e.target.value)}
                        ></input>
                    </div>
                    <PersonRecordList
                        personRecords={personRecords}
                        filter={listFilter}
                    />
                </div>
            </div>

            <Modal isOpen={isPhaseChangeOpen} onClose={closeModal}>
                <ChangePhaseModal
                    personRecords={personRecords}
                    onPhaseChangeComplete={refreshPersonRecords}
                />
            </Modal>
        </>
    );
};

export default DashboardPage;
