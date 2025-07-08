import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPersonRecordById } from "../api/personRecordApi";
import type { PersonRecord } from "../types/PersonRecord";
import ViewPersonRecord from '../components/ViewPersonRecord/ViewPersonRecord';

const ViewPersonPage = () => {
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
            }
            loadPerson();
        }
    }, [personId]);

    if(!personRecord) {
        return(
            <p>Unable to load the person from the server.</p>
        );
    }

    return (
        <>
            <h2>View Person Page</h2>
            <ViewPersonRecord
                person={ personRecord }
            />
        </>
    );
}

export default ViewPersonPage;