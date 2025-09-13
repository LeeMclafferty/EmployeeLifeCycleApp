import UserSettings from "../components/UserSettings/UserSettings";

const SettingsPage = () => {
    return (
        <>
            <div className="page-container">
                <div className="outter">
                    <h1>Settings Page</h1>
                    <h4>Make changes to users and the organization</h4>
                    <div className="settings-section">
                        <UserSettings></UserSettings>
                    </div>
                    <div className="settings-section"></div>
                </div>
            </div>
        </>
    );
};

export default SettingsPage;
