import './index.css'; // Главный файл стилей
import { initialCards } from './components/cards.js';
import { createCard, deleteCard } from './components/card.js';
import { openModal, closeModal, handleClickOutside } from './components/modal.js';

// Переменные для форм и элементов на странице
const profileEditFormElement = document.querySelector('.popup__form[name="edit-profile"]');
const newPlaceFormElement = document.querySelector('.popup__form[name="new-place"]');
const profileNameInput = profileEditFormElement.querySelector('.popup__input_type_name');
const profileJobInput = profileEditFormElement.querySelector('.popup__input_type_description');
const placeNameInput = newPlaceFormElement.querySelector('.popup__input_type_card-name');
const linkInput = newPlaceFormElement.querySelector('.popup__input_type_url');
const pageContent = document.querySelector('.page__content');
const addImageButton = pageContent.querySelector('.profile__add-button');
const editImageButton = pageContent.querySelector('.profile__edit-button');
const closeButtons = document.querySelectorAll('.popup__close');

// Элементы попапов
const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaptionElement = popupImage.querySelector('.popup__caption');

// Функция для открытия попапа с изображением
function handleImageClick(data) {
  popupImageElement.src = data.link;
  popupImageElement.alt = data.name;
  popupCaptionElement.textContent = data.name;

  openModal(popupImage);
}

// Отображение начальных карточек
function displayCards() {
  const cardsContainer = document.querySelector('.places__list');

  initialCards.forEach(cardData => {
    const cardElement = createCard({
      data: cardData,
      onDelete: deleteCard,
      onImageClick: handleImageClick
    });
    cardsContainer.append(cardElement);
  });
}

// Заполнение формы редактирования профиля текущими данными
function fillProfileForm() {
  const profileTitle = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');

  profileNameInput.value = profileTitle.textContent;
  profileJobInput.value = profileDescription.textContent;
}

// Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формы

  const name = profileNameInput.value;
  const job = profileJobInput.value;

  const profileTitle = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');

  profileTitle.textContent = name;
  profileDescription.textContent = job;

  closeModal(popupEdit);
  profileEditFormElement.reset(); // Сбрасываем форму после закрытия
}

// Обработчик отправки формы добавления новой карточки
function handleNewPlaceFormSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формы

  const placeName = placeNameInput.value;
  const link = linkInput.value;

  const newCardData = {
    name: placeName,
    link: link
  };

  const cardsContainer = document.querySelector('.places__list');
  const newCardElement = createCard({
    data: newCardData,
    onDelete: deleteCard,
    onImageClick: handleImageClick
  });

  // Добавляем новую карточку в начало контейнера
  cardsContainer.prepend(newCardElement);

  closeModal(popupNewCard);
  newPlaceFormElement.reset(); // Сбрасываем форму после закрытия
}

// Прикрепляем обработчики к формам
profileEditFormElement.addEventListener('submit', handleProfileFormSubmit);
newPlaceFormElement.addEventListener('submit', handleNewPlaceFormSubmit);

// Обработчик клика на кнопку редактирования профиля
editImageButton.addEventListener('click', () => {
  fillProfileForm(); // Заполняем поля формы текущими значениями
  openModal(popupEdit); // Открываем попап редактирования профиля
});

// Обработчик клика на кнопку добавления новой карточки
addImageButton.addEventListener('click', () => {
  openModal(popupNewCard); // Открываем попап добавления новой карточки
});

// Обработчик клика на крестики для закрытия попапов
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    closeModal(popup);
  });
});

// Прикрепляем обработчики клика вне попапа к каждому оверлею
[popupEdit, popupNewCard, popupImage].forEach(popup => {
  popup.addEventListener('click', handleClickOutside);
});

// Инициализация отображения карточек при загрузке страницы
displayCards();
