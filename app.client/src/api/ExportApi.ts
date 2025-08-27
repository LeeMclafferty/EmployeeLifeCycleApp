import { API_BASE_URL } from "../constants/constants";

export const downloadExcel = async () => {
    const res = await fetch(`${API_BASE_URL}/Export/Excel`, {
        method: "GET",
    });

    if (!res.ok) throw new Error("Failed to download Excel");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    // create a link and click it
    const a = document.createElement("a");
    a.href = url;
    a.download = "PersonRecords.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};
