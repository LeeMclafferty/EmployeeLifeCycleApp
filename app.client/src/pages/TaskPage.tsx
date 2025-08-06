import { useEffect, useState } from "react";
import TaskList from "../components/Tasks/TaskList";
import { type PersonRecord } from "../types/PersonRecordType";
import { getPersonRecordById } from "../api/PersonRecordApi";
import { useParams } from "react-router-dom";
import "./pageCSS/pages.css";

const TaskPage = () => {
    const { personId } = useParams();
    const [personRecord, setPersonRecord] = useState<PersonRecord | null>(null);

    useEffect(() => {
        if (personId) {
            const loadPerson = async () => {
                try {
                    const data = await getPersonRecordById(Number(personId));
                    setPersonRecord(data);
                } catch (err) {
                    console.log("Failed to fetch person", err);
                }
            };
            loadPerson();
        }
    }, [personId]);

    if (!personRecord) {
        return <div>Unable to load Person Record</div>;
    }
    return (
        <>
            <div className="page-container">
                <div className="outter">
                    <h1>Task Page</h1>
                    <h4>Complete task and stay up to date with progress</h4>
                    <TaskList personRecord={personRecord} />
                </div>
            </div>
        </>
    );
};

export default TaskPage;
