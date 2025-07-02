import { API_BASE_URL } from "../constants/constants";

export const getPersonRecords = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/personrecord/GetAll`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Server Error");
        }

        return await res.json();
    } catch (err) {
        console.error("Network or unexpected error:", err);
        throw err; // bubble up so the component can handle it
    }
}

export const addPersonRecord = async (personData: Record<string, any>) => {
    // Convert empty strings to null
    const cleanData: Record<string, any> = { ...personData };

    Object.keys(cleanData).forEach((key) => {
        if (cleanData[key] === "") cleanData[key] = null;
    });

    try {
        const res = await fetch(`${API_BASE_URL}/personrecord/Create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cleanData)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Server Error");
        }

        return await res.json(); // return created record or response
    } catch (err) {
        console.error("Network or unexpected error:", err);
        throw err; // bubble up so the component can handle it
    }
};
