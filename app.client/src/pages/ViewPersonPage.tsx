import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type PersonRecord } from "../types/PersonRecordType";
import ViewPersonRecord from "../components/ViewPersonRecord/ViewPersonRecord";
import "./pageCSS/pages.css";
import { getPersonRecordById } from "../api/PersonRecordApi";
import { getDisplayName } from "../helpers/formattingHelpers";

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
            };
            loadPerson();
        }
    }, [personId]);

    if (!personRecord) {
        return <p>Unable to load the person from the server.</p>;
    }

    return (
        <>
            <div className="page-container">
                <div className="outter">
                    <h1>Viewing {getDisplayName(personRecord)}</h1>
                    <h4>See all of the details for the person</h4>
                    <ViewPersonRecord person={personRecord} />
                </div>
            </div>
        </>
    );
};

export default ViewPersonPage;
