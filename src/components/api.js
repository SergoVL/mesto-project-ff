const BASE_URL = 'https://nomoreparties.co/v1/wff-cohort-24';
const token = 'e44f15f3-3bdc-4a52-9666-56efb0c15238';

// Проверка ответа от сервера
const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

// Функция для получения информации о профиле пользователя
export const getUserProfile = () => {
  return fetch(`${BASE_URL}/users/me`, {
    headers: {
      authorization: token
    }
  }).then(checkResponse);
};

// Функция для получения карточек
export const getCards = () => {
  return fetch(`${BASE_URL}/cards`, {
    headers: {
      authorization: token
    }
  }).then(checkResponse);
};

// Функция для обновления профиля пользователя
export const updateUserProfile = (name, about) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, about })
  }).then(checkResponse);
};

// Функция для добавления новой карточки
export const addCard = (name, link) => {
  return fetch(`${BASE_URL}/cards`, {
    method: 'POST',
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, link })
  }).then(checkResponse);
};

// Функция для удаления карточки
export const deleteCardFromApi = (cardId) => {
  return fetch(`${BASE_URL}/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: token,
    }
  }).then(checkResponse);
};

// Функция для лайка карточки
export const addLikeToApi = (cardId) => {
  return fetch(`${BASE_URL}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    }
  }).then(checkResponse);
};

// Функция для 'снятие' лайка карточки
export const removeLikeFromApi = (cardId) => {
  return fetch(`${BASE_URL}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: token
    }
  }).then(checkResponse);
};

// Функция для обновления аватара
export const updateUserAvatar = (avatar) => {
  return fetch(`${BASE_URL}/users/me/avatar`, {
    method: 'PATCH',
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ avatar })
  }).then(checkResponse);
};