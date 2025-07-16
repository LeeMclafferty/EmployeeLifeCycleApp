// apiClient.ts
import { API_BASE_URL } from "../constants/constants";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

/**
 * Makes a typed HTTP request to the backend API.
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
 * @throws Error if the response is not OK (non-2xx status code).
 */

export const apiRequest = async <TResponse, TBody = undefined>(
    path: string,
    method: HttpMethod = "GET",
    body?: TBody
): Promise<TResponse> => {
    const res = await fetch(`${API_BASE_URL}/${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Server Error");
    }

    return await res.json();
};
