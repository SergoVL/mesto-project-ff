export function openModal(modal) {
    modal.classList.add('popup_is-opened');
    modal.classList.remove('popup_is-animated');
    document.addEventListener('keydown', handleEscClose);
}

export function closeModal(modal) {
    modal.classList.add('popup_is-animated');
    modal.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscClose);

    const formElement = document.querySelector('.popup__form[name="edit-profile"]');
    const addPlaceFormElement = document.querySelector('.popup__form[name="new-place"]');

    if (modal.classList.contains('popup_type_edit') && formElement) {
        formElement.reset();
    }

    if (modal.classList.contains('popup_type_new-card') && addPlaceFormElement) {
        addPlaceFormElement.reset();
    }
}

function handleEscClose(event) {
    if (event.key === 'Escape') {
        const openModal = document.querySelector('.popup_is-opened');
        if (openModal) {
            closeModal(openModal);
        }
    }
}
