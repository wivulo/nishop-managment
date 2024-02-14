import { closeModal, openModal } from "./modalActions.js";

class Notification {
    #notificationElement;
    #notificationContent;
    #message;

    constructor(closeModal, openModal) {
        this.#notificationElement = document.getElementById("modal-notification");
        this.#notificationContent = document.getElementById("notification-modal-content");
        this.#message = document.getElementById("notification-message");
        this.closeModal = closeModal;
        this.openModal = openModal;
    }

    open(message, type) {
        this.#message.innerHTML = message;
        this.openModal(this.#notificationElement);
        this.#notificationContent.classList.add(type);

        setTimeout(() => {
            this.close();
        }, 1000);
    }

    close() {
        this.closeModal(this.#notificationElement);
    }
}

export const notification = new Notification(closeModal, openModal);
