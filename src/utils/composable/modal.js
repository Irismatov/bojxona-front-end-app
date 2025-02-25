import { ref } from "vue"
export function useModal() {
    const open = ref(false);
    function toggleModal(value, onToggle) {
        open.value = value;
        if (onToggle) onToggle();
    }
    function openModal(onOpen) {
        open.value = true;
        if (onOpen && typeof onOpen === 'function') onOpen()
    }
    function closeModal(onClose) {
        open.value = false;
        if(onClose && typeof onClose === 'function') onClose();
    }

    return { open, toggleModal, openModal, closeModal }
}
