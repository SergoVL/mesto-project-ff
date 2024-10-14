import { deleteCardFromApi, addLikeToApi, removeLikeFromApi } from './api.js';

export function deleteCard(cardId, cardElement) {
  deleteCardFromApi(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.error(`Ошибка при удалении карточки: ${err}`);
    });
}

export function createCard({ data, onDelete, onImageClick, currentUserId }) {
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

  const isOwner = data.owner._id === currentUserId;

  if (data.likes.some(user => user._id === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  if (!isOwner) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => {
      onDelete(data._id, cardElement);
    });
  }

  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');

    const likeMethod = isLiked ? removeLikeFromApi : addLikeToApi;
    likeMethod(data._id)
      .then(updatedCard => {
        likeButton.classList.toggle('card__like-button_is-active');
        likeCount.textContent = updatedCard.likes.length;
      })
      .catch(err => {
        console.error(`Ошибка при ${isLiked ? 'снятии' : 'постановке'} лайка: ${err}`);
      });
  });

  cardImage.addEventListener('click', () => onImageClick(data));

  return cardElement;
}