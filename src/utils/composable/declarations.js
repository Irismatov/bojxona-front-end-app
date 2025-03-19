import { reactive, ref } from "vue";
import { useApi } from "@/plugins/useApi";

export function useDeclarations() {
    const list = reactive([]);
    const totalElements = ref();
    const { fetchData, updateStatus, isLoading } = useApi();

    async function getDeclarations(status, type, params = {}) {
        const data = await fetchData(`/declarations/status/${status}/type/${type}/`, params);
        list.length = 0;
        list.push(...data.declarations);
        totalElements.value = data.totalElements;
        return data;
    }

    async function changeDeclarationStatus(id, status, successMessage) {
        const result = await updateStatus(`/declarations/${id}/status/${status}`, {}, successMessage);
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
        totalElements,
        isLoading,
        getDeclarations,
        changeDeclarationStatus,
        formatType
    }

}