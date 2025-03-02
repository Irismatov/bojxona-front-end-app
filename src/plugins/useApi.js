import axios from "@/plugins/axios"
import { ref } from "vue"
import { message } from "ant-design-vue"

export function useApi() {
    const isLoading = ref(false);
    const error = ref(null);

    async function fetchData(url, params = {}) {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await axios.get(url, { params });
            isLoading.value = false;
            if (response.data.resultCode === 0) {
                return response.data;
            }
            throw new Error(response.data.resultNote);
        } catch (err) {
            error.value = err;
            isLoading.value = false;
            message.error("Xatolik yuz berdi");
            throw err;
        }
    };

    async function updateStatus(url, params = { }, successMessage = "Muvaffaqiyatli yangilandi") {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await axios.put(url, { params });
            isLoading.value = false;
            if (response.data.resultCode === 0) {
                message.success(successMessage);
                return response.data;
            }
            throw new Error(response.data.resultCode);
        } catch (err) {
            error.value = err;
            isLoading.value = false;
            message.error("Xatolik yuz berdi");
            throw err;
        }
    }

    return {
        isLoading,
        error,
        fetchData,
        updateStatus
    }
}