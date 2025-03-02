import { ref } from "vue";
import { useApi } from "@/plugins/useApi";

export function useDeclarations() {
    const list = ref([]);
    const { fetchData, updateStatus, isLoading } = useApi();

    async function getDeclarations(status, type, params = { }) {
        const data = await fetchData(`api/declarations/status/${status}/type/${type}/`, params);
        list.value = data.declarations;
        return data;
    }

    async function changeDeclarationStatus(id, status, successMessage) {
        const result = await updateStatus(`api/declarations/${id}/status/${status}`, {}, successMessage);
        return result;
    }

    function formatType(type) {
        const types = {
            0: "МБ",
            1: "AT",
            2: "ИМЕИ"
        };
        return types[type] || "Номалум";
    }

    return {
        list,
        isLoading,
        getDeclarations,
        changeDeclarationStatus,
        formatType
    }

}