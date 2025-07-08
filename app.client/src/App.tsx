import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MainLayout from "./components/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import AddPersonPage from "./pages/AddPersonPage";
import EditPersonPage from "./pages/EditPersonPage";
import ViewPersonPage from "./pages/ViewPersonPage";
import TaskPage from "./pages/TaskPage";
import NotFoundPage from "./pages/NotFoundPage";


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<DashboardPage />}/>
                    <Route path="AddPerson" element={<AddPersonPage />} />
                    <Route path="EditPerson/:personId" element={<EditPersonPage />} />
                    <Route path="ViewPerson/:personId" element={<ViewPersonPage />} />
                    <Route path="Task/:personId" element={<TaskPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;