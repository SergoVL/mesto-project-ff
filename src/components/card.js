import { deleteCardFromApi, addLikeToApi, removeLikeFromApi } from './api.js';
import { openModal, closeModal } from './modal.js';

export function deleteCard(cardId, cardElement) {
  deleteCardFromApi(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.error(`Ошибка при удалении карточки: ${err}`);
    });
}

export function createCard({ data, onDelete, onImageClick, isOwner, currentUserId }) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;
  likeCount.textContent = data.likes.length;

  if (data.likes.some(user => user._id === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  if (!isOwner) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => {
      const popupDelete = document.querySelector('.popup_type_delete');
      const confirmButton = popupDelete.querySelector('.popup__button');

      openModal(popupDelete);

      confirmButton.onclick = () => {
        onDelete(data._id, cardElement);
        closeModal(popupDelete);
      };
    });
  }

  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');

    if (isLiked) {
      removeLikeFromApi(data._id)
        .then(updatedCard => {
          likeButton.classList.remove('card__like-button_is-active');
          likeCount.textContent = updatedCard.likes.length;
        })
        .catch((err) => {
          console.error(`Ошибка при снятии лайка: ${err}`);
        });
    } else {
      addLikeToApi(data._id)
        .then(updatedCard => {
          likeButton.classList.add('card__like-button_is-active');
          likeCount.textContent = updatedCard.likes.length;
        })
        .catch((err) => {
          console.error(`Ошибка при постановке лайка: ${err}`);
        });
    }
  });

  cardImage.addEventListener('click', () => onImageClick(data));

  return cardElement;
}
