export const openModal = (modal) => {
    try {
        // console.log(toEditModal.classList);
        if (modal.classList.contains("close")) {
            modal.classList.replace("close", "open");
        } else {
            modal.classList.add("open");
        }
    } catch (e) {
        console.log(e);
    }
}

export const closeModal = (modal) => {
    try {
        if (modal.classList.contains("open")) {
            modal.classList.replace("open", "close");
        } else {
            modal.classList.add("close");
        }
    } catch (e) {
        console.log(e);
    }
}