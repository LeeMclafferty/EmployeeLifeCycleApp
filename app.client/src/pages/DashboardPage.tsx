import PersonRecordList from "../components/personRecordList/PersonRecordList";
import "./pageCSS/pages.css";

const DashboardPage = () => {
    return (
        <>
            <h1>Dashboard Page</h1>
            <h4>An overview of all users and tasks</h4>
            <PersonRecordList />
        </>
    );
};

export default DashboardPage;
