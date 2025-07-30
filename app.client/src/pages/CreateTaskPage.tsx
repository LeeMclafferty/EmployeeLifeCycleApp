import CreateTaskForm from "../components/CreateTask/CreateTaskFrom";
import "./pageCSS/pages.css";
const CreateTaskPage = () => {
    return (
        <>
            <h1>Create Task</h1>
            <h4>Add a new onboarding or offboarding task</h4>
            <CreateTaskForm />
        </>
    );
};

export default CreateTaskPage;
