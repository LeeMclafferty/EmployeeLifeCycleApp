import AddPersonRecordForm from "../components/AddPersonRecordForm/AddPersonRecordForm";
import "./pageCSS/pages.css";

const AddPersonPage = () => {
    return (
        <>
            <div className="page-container">
                <div className="outter">
                    <h1>Add Person Page</h1>
                    <h4>Add a new person for onboarding</h4>
                    <AddPersonRecordForm />
                </div>
            </div>
        </>
    );
};

export default AddPersonPage;
