import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div>
            <header>My App Header</header>
            <Outlet /> {/* This is where child pages go */}
        </div>
    );
};

export default MainLayout;