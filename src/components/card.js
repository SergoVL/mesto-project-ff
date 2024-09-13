export function createCard({ data, onDelete, onImageClick }) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    cardImage.src = data.link;
    cardImage.alt = data.name;
    cardTitle.textContent = data.name;

    deleteButton.addEventListener('click', () => onDelete(cardElement));
    likeButton.addEventListener('click', () => handleLikeButton(likeButton));

    cardImage.addEventListener('click', () => onImageClick(data));

    return cardElement;
}

export function deleteCard(cardElement) {
    cardElement.remove();
}

export function handleLikeButton(likeButton) {
    likeButton.classList.toggle('card__like-button_is-active');
}
