const cohortId = 'wff-cohort-24';
const token = 'e44f15f3-3bdc-4a52-9666-56efb0c15238';

// Проверка ответа от сервера
const checkResponse = (res) => {
  if (res.ok) {
    return res.json(); // Возвращаем результат, если запрос успешен
  }
  return Promise.reject(`Ошибка: ${res.status}`); // Возвращаем ошибку, если запрос неудачный
};

// Функция для получения информации о профиле пользователя
export const getUserProfile = () => {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/users/me`, {
    headers: {
      authorization: token
    }
  })
    .then(checkResponse)
    .catch((err) => {
      console.error(`Ошибка получения профиля: ${err}`);
    });
};

// Функция для получения карточек
export const getCards = () => {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/cards`, {
    headers: {
      authorization: token
    }
  })
    .then(checkResponse)
    .catch((err) => {
      console.error(`Ошибка получения карточек: ${err}`);
    });
};

// Функция для обновления профиля пользователя
export const updateUserProfile = (name, about) => {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/users/me`, {
    method: 'PATCH',
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      about: about
    })
  })
    .then(checkResponse)
    .catch((err) => {
      console.error(`Ошибка обновления профиля: ${err}`);
    });
};

// Функция для добавления новой карточки
export const addCard = (name, link) => {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/cards`, {
    method: 'POST',
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      link: link
    })
  })
    .then(checkResponse)
    .catch((err) => {
      console.error(`Ошибка добавления карточки: ${err}`);
    });
};

// Функция для удаления карточки
export const deleteCardFromApi = (cardId) => {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: token,
    }
  })
    .then(checkResponse)
    .catch(err => {
      console.error(`Ошибка удаления карточки: ${err}`);
    });
};

// Функция для лайка карточки
export const addLikeToApi = (cardId) => {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    }
  })
    .then(checkResponse)
    .catch((err) => {
      console.error(`Ошибка при постановке лайка: ${err}`);
    });
};

// Функция для 'снятие' лайка карточки
export const removeLikeFromApi = (cardId) => {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: token
    }
  })
    .then(checkResponse)
    .catch((err) => {
      console.error(`Ошибка при снятии лайка: ${err}`);
    });
};

// Функция для обновления аватара
export const updateUserAvatar = (avatar) => {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/users/me/avatar`, {
    method: 'PATCH',
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      avatar: avatar
    })
  })
    .then(checkResponse)
    .catch((err) => {
      console.error(`Ошибка обновления аватара: ${err}`);
    });
};
