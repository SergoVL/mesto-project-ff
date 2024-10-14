function showError(input, config) {
  input.classList.add('popup__input_type_error');

  const errorElement = input.parentElement.querySelector(`.popup__error[data-error-for="${input.name}"]`);
  errorElement.textContent = input.validationMessage;
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
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.dataset.errorMessage || '');
  } else {
    input.setCustomValidity('');
  }

  if (!input.validity.valid) {
    showError(input, config);
    return false;
  }

  hideError(input, config);
  return true;
}

const disableSubmitButton = (button, config) => {
  button.setAttribute('disabled', true);
  button.classList.add(config.inactiveButtonClass);
};

const enableSubmitButton = (button, config) => {
  button.removeAttribute('disabled');
  button.classList.remove(config.inactiveButtonClass);
};

function toggleButtonState(inputs, button, config) {
  const hasInvalidInput = [...inputs].some(input => !input.validity.valid);

  if (hasInvalidInput) {
    disableSubmitButton(button, config);
  } else {
    enableSubmitButton(button, config);
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
  inputs.forEach(input => hideError(input, config));

  const submitButton = form.querySelector(config.submitButtonSelector);
  disableSubmitButton(submitButton, config);
}

function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach(form => validateForm(form, config));
}

export { enableValidation, clearValidation };