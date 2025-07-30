import AddPersonRecordForm from "../components/AddPersonRecordForm/AddPersonRecordForm";
import "./pageCSS/pages.css";

const AddPersonPage = () => {
    return (
        <>
            <h1>Add Person Page</h1>
            <h4>Add a new person for onboarding</h4>
            <AddPersonRecordForm />
        </>
    );
};

export default AddPersonPage;
