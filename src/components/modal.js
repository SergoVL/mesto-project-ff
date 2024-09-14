export function openModal(modal) {
  modal.classList.add('popup_is-opened');
  modal.classList.remove('popup_is-animated');
  document.addEventListener('keydown', handleEscClose);
}

export function closeModal(modal) {
  modal.classList.add('popup_is-animated');
  modal.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscClose);
}

function handleEscClose(event) {
  if (event.key === 'Escape') {
    const openModal = document.querySelector('.popup_is-opened');
    if (openModal) {
      closeModal(openModal);
    }
  }
}

// Обработчик клика вне модального окна для его закрытия
export function handleClickOutside(event) {
  if (event.target === event.currentTarget) {
    closeModal(event.target); // Закрываем модальное окно (оверлей)
  }
}
