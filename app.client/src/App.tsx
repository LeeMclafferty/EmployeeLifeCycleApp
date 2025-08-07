import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import AddPersonPage from "./pages/AddPersonPage";
import EditPersonPage from "./pages/EditPersonPage";
import ViewPersonPage from "./pages/ViewPersonPage";
import TaskPage from "./pages/TaskPage";
import NotFoundPage from "./pages/NotFoundPage";
import CreateTaskPage from "./pages/CreateTaskPage";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="Person/Create" element={<AddPersonPage />} />
                    <Route
                        path="Person/Edit/:personId"
                        element={<EditPersonPage />}
                    />
                    <Route
                        path="Person/Read/:personId"
                        element={<ViewPersonPage />}
                    />
                    <Route path="Task/:personId" element={<TaskPage />} />
                    <Route path="Task/Create" element={<CreateTaskPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
