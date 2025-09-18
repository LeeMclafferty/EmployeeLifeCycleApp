import UserSettings from "../components/UserSettings/UserSettings";
import "./pageCSS/SettingsPage.css";

const SettingsPage = () => {
    return (
        <>
            <div className="page-container">
                <div className="outter">
                    <h1>Settings Page</h1>
                    <h4>Make changes to users and the organization</h4>
                    <div className="section-break">User Settings</div>
                    <div className="settings-section">
                        <UserSettings></UserSettings>
                    </div>
                    <div className="section-break">Organization Settings</div>
                    <div className="settings-section"></div>
                </div>
            </div>
        </>
    );
};

export default SettingsPage;
