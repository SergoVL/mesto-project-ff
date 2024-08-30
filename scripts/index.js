// Функция создания карточки
function createCard(data, deleteCard) {
  // Клонируем содержимое шаблона
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  // Находим нужные элементы внутри карточки
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  // Устанавливаем значения для карточки
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  // Добавляем обработчик события на кнопку удаления
  deleteButton.addEventListener('click', () => deleteCard(cardElement));

  return cardElement;
}

// Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}

// Выводим карточки на страницу
function displayCards() {
  const placesList = document.querySelector('.places__list');

  initialCards.forEach(cardData => {
    const cardElement = createCard(cardData, deleteCard);
    placesList.append(cardElement);
  });
}

// Вызов функции для отображения карточек при загрузке страницы
displayCards();
