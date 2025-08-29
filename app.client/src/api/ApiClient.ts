import { loginRequest, msalInstance } from "../authConfig";
import { API_BASE_URL } from "../constants/constants";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

/**
 * Makes a typed HTTP request to the backend API with an access token.
 *
 * @template TResponse - The expected shape of the response data.
 * @template TBody - The shape of the request body (optional).
 *
 * @param path - The API endpoint path (e.g., "PersonRecord/Phase").
 * @param method - The HTTP method to use (GET, POST, PUT, DELETE). Defaults to "GET".
 * @param body - The request body to send (for POST/PUT requests). Will be stringified if provided.
 *
 * @returns A promise resolving to the parsed response data of type TResponse.
 *
 * @throws Error if no account is found, token acquisition fails, or response is not OK.
 */
export const apiRequest = async <TResponse, TBody = undefined>(
    path: string,
    method: HttpMethod = "GET",
    body?: TBody
): Promise<TResponse> => {
    // Ensure a signed-in account is available
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
        throw new Error(
            "No signed-in account. Did you wrap your app in AuthGuard?"
        );
    }

    // Acquire a token silently
    const tokenResponse = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
    });

    // Call backend with Bearer token
    const res = await fetch(`${API_BASE_URL}/${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || `Request failed with status ${res.status}`);
    }

    // Return JSON typed as TResponse
    return (await res.json()) as TResponse;
};
