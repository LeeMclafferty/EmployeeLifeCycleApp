import { useEffect, useState } from "react";
import EditPersonRecordForm from "../components/EditPersonRecordForm/EditPersonRecordForm";
import { useParams } from "react-router-dom";
import { getPersonRecordById } from "../api/personRecordApi";
import { type PersonRecord } from "../types/PersonRecordType";
import "./pageCSS/pages.css";
import "./pageCSS/EditPersonPage.css";
import { getDisplayName } from "../helpers/FormattingHelpers";

const EditPersonPage = () => {
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
                    <h1>Editing {getDisplayName(personRecord)}</h1>
                    <h4>Make changes to an existing person</h4>
                    <EditPersonRecordForm person={personRecord} />
                </div>
            </div>
        </>
    );
};

export default EditPersonPage;
