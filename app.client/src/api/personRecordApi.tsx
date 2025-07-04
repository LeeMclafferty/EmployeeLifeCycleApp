import { API_BASE_URL } from "../constants/constants";
import type { PersonRecord } from "../types/PersonRecord";

export const getPersonRecords = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/personrecord/Get`, {
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

export const addPersonRecord = async (personData: PersonRecord) => {
    console.log("Sending PersonRecord:", JSON.stringify(personData));

    try {
        const res = await fetch(`${API_BASE_URL}/personrecord/Create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(personData)
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

export const getPersonRecordById = async (id: number) => {
    try {
        const res = await fetch(`${API_BASE_URL}/Get/${id}`, {
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
    } catch (err){
        console.error("Network or unexpected error:", err);
        throw err; // bubble up so the component can handle it
    }
}

export const updatePersonRecord = async (person: PersonRecord) => {
    try {
        const res = await fetch(`${API_BASE_URL}/Update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(person)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Server Error");
        }

        return res.json();
    } catch (err) {
        console.error("Network or unexpected error:", err);
        throw err; // bubble up so the component can handle it
    }
}