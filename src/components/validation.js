function showError(input, message, config) {
  input.classList.add('popup__input_type_error');
  const errorElement = input.parentElement.querySelector(`.popup__error[data-error-for="${input.name}"]`);
  errorElement.textContent = message;
  errorElement.classList.add(config.errorClass);
  errorElement.classList.add('popup__error_visible');
}

function hideError(input, config) {
  input.classList.remove('popup__input_type_error');
  const errorElement = input.parentElement.querySelector(`.popup__error[data-error-for="${input.name}"]`);
  errorElement.textContent = '';
  errorElement.classList.remove(config.errorClass);
  errorElement.classList.remove('popup__error_visible');
}

function checkInputValidity(input, config) {
  const namePattern = /^[а-яА-ЯёЁa-zA-Z -]+$/;
  const minLength = 2;
  let maxLength;

  // Установка максимальной длины в зависимости от имени поля
  switch (input.name) {
    case 'name':
      maxLength = 40;
      break;
    case 'description':
      maxLength = 200;
      break;
    case 'place-name':
      maxLength = 30;
      break;
  }

  // Проверка на пустое значение
  if (!input.value) {
    showError(input, 'Вы пропустили это поле', config);
    return false;
  }

  // Проверка длины и соответствия для полей, кроме 'link'
  if (input.name !== 'link') {
    if (input.value.length < minLength) {
      showError(input, `Минимальное количество символов: ${minLength}. Длина текста сейчас: ${input.value.length}`, config);
      return false;
    } else if (input.value.length > maxLength) {
      showError(input, `Максимальное количество символов: ${maxLength}.`, config);
      return false;
    } else if (!namePattern.test(input.value)) {
      showError(input, 'Разрешены только буквы, дефисы и пробелы', config);
      return false;
    }
  }

  // Валидация для поля link
  if (input.name === 'link') {
    if (!input.validity.valid) {
      showError(input, input.validationMessage, config);
      return false;
    } else {
      hideError(input, config);
    }
  } else if (!input.validity.valid) {
    showError(input, input.validationMessage, config);
    return false;
  } else {
    hideError(input, config);
  }

  return true;
}


function toggleButtonState(inputs, button, config) {
  const hasErrors = [...inputs].some(input => {
    return !checkInputValidity(input, config);
  });

  if (hasErrors) {
    button.setAttribute('disabled', true);
    button.classList.add(config.inactiveButtonClass);
  } else {
    button.removeAttribute('disabled');
    button.classList.remove(config.inactiveButtonClass);
  }
}

function validateForm(form, config) {
  const inputs = form.querySelectorAll(config.inputSelector);
  const submitButton = form.querySelector(config.submitButtonSelector);

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      checkInputValidity(input, config);
      toggleButtonState(inputs, submitButton, config);
    });
  });

  toggleButtonState(inputs, submitButton, config);
}

function clearValidation(form, config) {
  const inputs = form.querySelectorAll(config.inputSelector);
  inputs.forEach(input => {
    hideError(input, config);
  });

  const submitButton = form.querySelector(config.submitButtonSelector);
  submitButton.setAttribute('disabled', true);
  submitButton.classList.add(config.inactiveButtonClass);
}


function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach(form => {
    validateForm(form, config);
  });
}

export { enableValidation, clearValidation };
