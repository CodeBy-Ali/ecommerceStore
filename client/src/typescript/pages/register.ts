import { togglePasswordVisibility } from "../components/utils/util";
import isFormValid from "../components/validator/validator";





const handleFormSubmit = async(e:Event): Promise<void> => {
  e.preventDefault();
  const registerForm = document.querySelector('[data-registerForm]') as HTMLFormElement;

  if (!registerForm || registerForm.elements.length < 4) {
    throw new Error('Register form elements are missing or form is invalid')
  }
  
  if (!isFormValid(registerForm)) return;

  const [firstNameField, lastNameField, emailField, passwordField] = Array.from(registerForm.elements) as [
    HTMLInputElement,
    HTMLInputElement,
    HTMLInputElement,
    HTMLInputElement,
  ];

  try {
    const response = fetch('/register', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: firstNameField.value,
        lastName: lastNameField.value,
        emailField: emailField.value,
        passwordField: passwordField.value,
      })
    })
  } catch (error) {
    console.log(error);
  }
  
}


const initRegisterPage = (): void => {
  const eyeIconButton: HTMLElement | null = document.querySelector('[data-eyeIconButton]');
  const eyeIcon = document.querySelector('.eye_icon') as HTMLElement;
  const passwordField = document.querySelector('[data-passwordField]') as HTMLInputElement;
  const submitButton:HTMLElement | null = document.querySelector('[data-submitButton]');

  if (!eyeIcon || !passwordField) return;

  if (eyeIconButton) {
    eyeIconButton.addEventListener('click', () => togglePasswordVisibility(eyeIcon, passwordField))
  }

  if (submitButton) {
    submitButton.addEventListener('click', handleFormSubmit);
  }

}

export default initRegisterPage;