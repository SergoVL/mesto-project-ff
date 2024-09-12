export function createCard(data, deleteCard, handleImageClick) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    cardImage.src = data.link;
    cardImage.alt = data.name;
    cardTitle.textContent = data.name;

    deleteButton.addEventListener('click', () => deleteCard(cardElement));
    likeButton.addEventListener('click', () => {
        likeButton.classList.toggle('card__like-button_is-active');
    });

    // Обработчик клика по изображению
    cardImage.addEventListener('click', () => handleImageClick(data));

    return cardElement;
}

export function deleteCard(cardElement) {
    cardElement.remove();
}
