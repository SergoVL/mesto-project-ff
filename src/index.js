import './index.css';
import { createCard, deleteCard } from './components/card.js';
import { openModal, closeModal, handleClickOutside } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import { updateUserAvatar, getUserProfile, getCards, updateUserProfile, addCard } from './components/api.js';

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

// Переменные для формы обновления аватара
const avatarFormElement = document.querySelector('.popup__form[name="edit-avatar"]');
const avatarLinkInput = avatarFormElement.querySelector('.popup__input_type_avatar');
const editAvatarButton = document.querySelector('.profile__edit-avatar');
const popupAvatar = document.querySelector('.popup_type_edit_avatar');

// Элементы попапов
const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaptionElement = popupImage.querySelector('.popup__caption');

// Функция для отображения данных профиля на странице
const renderUserProfile = (userData) => {
  const profileTitle = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');
  const profileImage = document.querySelector('.profile__image');

  profileTitle.textContent = userData.name;
  profileDescription.textContent = userData.about;
  profileImage.style.backgroundImage = `url(${userData.avatar})`;
};

// Функция для отображения карточек на странице
const renderCards = (cards, currentUserId) => {
  const cardsContainer = document.querySelector('.places__list');
  cards.forEach(cardData => {
    const cardElement = createCard({
      data: cardData,
      onDelete: deleteCard,
      onImageClick: handleImageClick,
      isOwner: cardData.owner._id === currentUserId,
      currentUserId
    });
    cardsContainer.append(cardElement);
  });
};

// Получение данных профиля пользователя и карточек при загрузке страницы
Promise.all([getUserProfile(), getCards()])
  .then(([userData, cards]) => {
    renderUserProfile(userData);
    renderCards(cards, userData._id);
  })
  .catch((err) => {
    console.error(`Ошибка при загрузке данных: ${err}`);
  });

// Функция для открытия попапа с изображением
function handleImageClick(data) {
  popupImageElement.src = data.link;
  popupImageElement.alt = data.name;
  popupCaptionElement.textContent = data.name;

  openModal(popupImage);
}

// Функция для заполнения формы редактирования профиля текущими данными
function fillProfileForm() {
  const profileTitle = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');

  // Заполняем поля формы текущими значениями
  profileNameInput.value = profileTitle.textContent;
  profileJobInput.value = profileDescription.textContent;

  // Очищаем сообщения об ошибках
  clearValidation(profileEditFormElement, {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  });

  // Проверяем значения и активируем кнопку, если поля не пустые
  const isNameValid = profileNameInput.value.trim() !== '';
  const isJobValid = profileJobInput.value.trim() !== '';

  const submitButton = profileEditFormElement.querySelector('.popup__button');
  if (isNameValid && isJobValid) {
    submitButton.removeAttribute('disabled');
    submitButton.classList.remove('popup__button_disabled');
  } else {
    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('popup__button_disabled');
  }
}

// Обработчик отправки формы редактирования профиля
async function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const name = profileNameInput.value;
  const job = profileJobInput.value;

  const submitButton = profileEditFormElement.querySelector('.popup__button');
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  try {
    const updatedUser = await updateUserProfile(name, job);

    renderUserProfile(updatedUser);
    closeModal(popupEdit);
    profileEditFormElement.reset();
  } catch (error) {
    console.error('Не удалось обновить профиль:', error);
  } finally {
    submitButton.textContent = 'Сохранить';
    submitButton.disabled = false;
  }
}

// Обработчик отправки формы добавления новой карточки
async function handleNewPlaceFormSubmit(evt) {
  evt.preventDefault();

  const placeName = placeNameInput.value;
  const link = linkInput.value;

  const submitButton = newPlaceFormElement.querySelector('.popup__button');
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  try {
    const newCardData = await addCard(placeName, link);

    const currentUser = await getUserProfile();

    const cardsContainer = document.querySelector('.places__list');
    const newCardElement = createCard({
      data: newCardData,
      onDelete: deleteCard,
      onImageClick: handleImageClick,
      isOwner: newCardData.owner._id === currentUser._id,
      currentUserId: currentUser._id
    });

    // Добавляем новую карточку в начало контейнера
    cardsContainer.prepend(newCardElement);

    closeModal(popupNewCard);
    newPlaceFormElement.reset();
  } catch (error) {
    console.error('Не удалось добавить карточку:', error);
  } finally {
    submitButton.textContent = 'Сохранить';
    submitButton.disabled = false;
  }
}

// Функция для обновления аватара
async function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  const avatarLink = avatarLinkInput.value;

  const submitButton = avatarFormElement.querySelector('.popup__button');
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  try {
    const updatedUser = await updateUserAvatar(avatarLink);

    renderUserProfile(updatedUser);
    closeModal(popupAvatar);
    avatarFormElement.reset();
  } catch (error) {
    console.error('Ошибка обновления аватара:', error);
  } finally {
    submitButton.textContent = 'Сохранить';
    submitButton.disabled = false;
  }
}

// Открытие попапа для обновления аватара
editAvatarButton.addEventListener('click', () => {
  openModal(popupAvatar);
});

// Обработчик отправки формы обновления аватара
avatarFormElement.addEventListener('submit', handleAvatarFormSubmit);

profileEditFormElement.addEventListener('submit', handleProfileFormSubmit);
newPlaceFormElement.addEventListener('submit', handleNewPlaceFormSubmit);

// Обработчик клика на кнопку редактирования профиля
editImageButton.addEventListener('click', () => {
  fillProfileForm();
  openModal(popupEdit);
});

// Обработчик клика на кнопку добавления новой карточки
addImageButton.addEventListener('click', () => {
  clearValidation(newPlaceFormElement, {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  });

  newPlaceFormElement.reset();

  openModal(popupNewCard);
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

// Активация валидации для всех форм
enableValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled', // Класс для неактивной кнопки
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
});
