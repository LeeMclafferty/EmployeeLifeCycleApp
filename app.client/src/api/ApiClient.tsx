// apiClient.ts
import { API_BASE_URL } from "../constants/constants";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const apiRequest = async <TResponse, TBody = undefined>(
    path: string,
    method: HttpMethod = 'GET',
    body?: TBody
): Promise<TResponse> => {
    const res = await fetch(`${API_BASE_URL}/${path}`, {
    method,
    headers: {
    'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Server Error");
    }

    return await res.json();
};

