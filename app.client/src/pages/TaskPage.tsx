import { useEffect, useState } from "react";
import TaskList from "../components/Tasks/TaskList";
import { type PersonRecord } from "../types/PersonRecordType";
import { getPersonRecordById } from "../api/personRecordApi";
import { useParams } from "react-router-dom";

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
            <h2>Task Page</h2>
            <TaskList personRecord={personRecord} />
        </>
    );
};

export default TaskPage;
