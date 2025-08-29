import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: "94bc25b6-d132-42d2-9cde-e1821bf2a1f3",
        authority:
            "https://login.microsoftonline.com/94a477aa-7455-4b91-b845-70b20500dc21",
        redirectUri: "https://localhost:49866/", // React dev server
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

export const loginRequest = {
    scopes: ["api://fa365569-1f50-47aa-a135-a559897501fb/UserImpersonation"],
};

// Singleton instance for the whole app
export const msalInstance = new PublicClientApplication(msalConfig);
