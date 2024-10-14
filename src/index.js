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

// Общий объект конфигурации валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

let currentUser;

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
const renderCards = (cards) => {
  const cardsContainer = document.querySelector('.places__list');
  cards.forEach(cardData => {
    const cardElement = createCard({
      data: cardData,
      onDelete: handleDelete,
      onImageClick: handleImageClick,
      currentUserId: currentUser._id
    });
    cardsContainer.append(cardElement);
  });
};

// Получение данных профиля пользователя и карточек при загрузке страницы
Promise.all([getUserProfile(), getCards()])
  .then(([userData, cards]) => {
    currentUser = userData;
    renderUserProfile(userData);
    renderCards(cards);
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

  profileNameInput.value = profileTitle.textContent;
  profileJobInput.value = profileDescription.textContent;

  clearValidation(profileEditFormElement, validationConfig);
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
    currentUser = updatedUser;
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

    const cardsContainer = document.querySelector('.places__list');
    const newCardElement = createCard({
      data: newCardData,
      onDelete: handleDelete,
      onImageClick: handleImageClick,
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
    currentUser = updatedUser;
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

// Функция для обработки удаления карточки
function handleDelete(cardId, cardElement) {
  const popupDelete = document.querySelector('.popup_type_delete');
  const confirmButton = popupDelete.querySelector('.popup__button');

  openModal(popupDelete);

  confirmButton.onclick = () => {
    deleteCard(cardId, cardElement);
    closeModal(popupDelete);
  };
}

// Функция для обработки лайка карточки
function handleLike(cardId, isLiked, likeButton, likeCount) {
  if (isLiked) {
    removeLikeFromApi(cardId)
      .then(updatedCard => {
        likeButton.classList.remove('card__like-button_is-active');
        likeCount.textContent = updatedCard.likes.length;
      })
      .catch((err) => {
        console.error(`Ошибка при снятии лайка: ${err}`);
      });
  } else {
    addLikeToApi(cardId)
      .then(updatedCard => {
        likeButton.classList.add('card__like-button_is-active');
        likeCount.textContent = updatedCard.likes.length;
      })
      .catch((err) => {
        console.error(`Ошибка при постановке лайка: ${err}`);
      });
  }
}

// Открытие попапа для обновления аватара
editAvatarButton.addEventListener('click', () => {
  openModal(popupAvatar);
});

// Обработчик отправки формы обновления аватара
avatarFormElement.addEventListener('submit', handleAvatarFormSubmit);

// Обработчик отправки формы редактирования профиля
profileEditFormElement.addEventListener('submit', handleProfileFormSubmit);

// Обработчик отправки формы добавления новой карточки
newPlaceFormElement.addEventListener('submit', handleNewPlaceFormSubmit);

// Обработчик клика на кнопку редактирования профиля
editImageButton.addEventListener('click', () => {
  fillProfileForm();
  openModal(popupEdit);
});

// Обработчик клика на кнопку добавления новой карточки
addImageButton.addEventListener('click', () => {
  clearValidation(newPlaceFormElement, validationConfig);
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
enableValidation(validationConfig);