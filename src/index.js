import './index.css'; // Импорт главного файла стилей 
// Импорт модулей
import { initialCards } from './cards.js';
import { createCard, deleteCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';

// Переменные
const formElement = document.querySelector('.popup__form[name="edit-profile"]');
const addPlaceFormElement = document.querySelector('.popup__form[name="new-place"]');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');
const placeNameInput = addPlaceFormElement.querySelector('.popup__input_type_card-name');
const linkInput = addPlaceFormElement.querySelector('.popup__input_type_url');
const pageContent = document.querySelector('.page__content');
const addImageButton = pageContent.querySelector('.profile__add-button');
const editImageButton = pageContent.querySelector('.profile__edit-button');
const closeButtons = document.querySelectorAll('.popup__close');

// Функция для открытия попапа с изображением
function handleImageClick(data) {
  const popupImage = document.querySelector('.popup_type_image');
  const popupImageElement = popupImage.querySelector('.popup__image');
  const popupCaptionElement = popupImage.querySelector('.popup__caption');

  popupImageElement.src = data.link;
  popupImageElement.alt = data.name;
  popupCaptionElement.textContent = data.name;

  openModal(popupImage);
}

// Выводим карточки на страницу
function displayCards() {
  const cardsContainer = document.querySelector('.places__list');

  initialCards.forEach(cardData => {
    const cardElement = createCard(cardData, deleteCard, handleImageClick);
    cardsContainer.append(cardElement);
  });
}

// Функция для установки значений полей формы на основе текущих данных
function fillProfileForm() {
  const profileTitle = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');

  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
}

// Обработчик «отправки» формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault(); // отменяем стандартную отправку формы

  const name = nameInput.value;
  const job = jobInput.value;

  const profileTitle = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');

  profileTitle.textContent = name;
  profileDescription.textContent = job;

  closeModal(document.querySelector('.popup_type_edit'));
}

// Обработчик «отправки» формы добавления новой карточки
function handleAddPlaceFormSubmit(evt) {
  evt.preventDefault(); // отменяем стандартную отправку формы

  const placeName = placeNameInput.value;
  const link = linkInput.value;

  const newCardData = {
    name: placeName,
    link: link
  };

  const cardsContainer = document.querySelector('.places__list');
  const newCardElement = createCard(newCardData, deleteCard, handleImageClick);

  // Добавляем новую карточку в начало контейнера
  cardsContainer.prepend(newCardElement);

  closeModal(document.querySelector('.popup_type_new-card'));
}

// Прикрепляем обработчики к формам
formElement.addEventListener('submit', handleProfileFormSubmit);
addPlaceFormElement.addEventListener('submit', handleAddPlaceFormSubmit);

// Обработчик клика на кнопку редактирования профиля
editImageButton.addEventListener('click', () => {
  fillProfileForm(); // Устанавливаем значения полей формы
  openModal(document.querySelector('.popup_type_edit')); // Открываем попап
});

// Обработчик клика на кнопку добавления новой карточки
addImageButton.addEventListener('click', () => {
  openModal(document.querySelector('.popup_type_new-card'));
});

// Обработчик клика на крестики для закрытия попапов
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    closeModal(popup);
  });
});

// Обработчик клика вне попапа для его закрытия
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('popup_is-opened')) {
    closeModal(event.target);
  }
});

// Вызов функции для отображения карточек при загрузке страницы
displayCards();
