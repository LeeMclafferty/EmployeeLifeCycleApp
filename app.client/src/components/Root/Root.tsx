import { StrictMode, useEffect, useState } from "react";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "../../authConfig";
import App from "../../App";

export default function Root() {
    const [msalReady, setMsalReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                await msalInstance.initialize();
                await msalInstance.handleRedirectPromise();
                setMsalReady(true);
            } catch (err) {
                console.error("MSAL init failed:", err);
            }
        };

        init();
    }, []);

    if (!msalReady) {
        return <div>Loading authentication...</div>;
    }

    return (
        <StrictMode>
            <MsalProvider instance={msalInstance}>
                <App />
            </MsalProvider>
        </StrictMode>
    );
}
