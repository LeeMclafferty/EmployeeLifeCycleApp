import { apiRequestBlob } from "./ApiClient";

export const downloadExcel = async () => {
    const blob = await apiRequestBlob("export/excel", "GET");
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "PersonRecords.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
};
