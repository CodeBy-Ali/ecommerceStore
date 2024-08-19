import { togglePasswordVisibility, showNotification } from "../components/utils/pagesUtils";
import isFormValid from "../components/validator/validator";

const handleFormSubmit = async (e: Event, registerForm: HTMLFormElement): Promise<void> => {
  e.preventDefault();

  if (!registerForm || registerForm.elements.length < 4) {
    throw new Error("Register form elements are missing or form is invalid");
  }

  if (!isFormValid(registerForm)) return;

  const firstNameField = document.querySelector<HTMLInputElement>("[data-firstNameField]");
  const lastNameField = document.querySelector<HTMLInputElement>("[data-lastNameField]");
  const emailField = document.querySelector<HTMLInputElement>("[data-emailField]");
  const passwordField = document.querySelector<HTMLInputElement>("[data-passwordField]");

  try {
    const response = await fetch("/account/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstNameField?.value,
        lastName: lastNameField?.value,
        email: emailField?.value,
        password: passwordField?.value,
      }),
    });

    if (!response.ok) {
      const responseBody = await response.json();
      showNotification(responseBody?.message, false);
      return;
    }

    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (error) {
    console.log(error);
  }
};

//  initialize Register page
const initRegisterPage = (): void => {
  const eyeIconButton: HTMLElement | null = document.querySelector("[data-eyeIconButton]");
  const eyeIcon = document.querySelector(".eye_icon") as HTMLElement;
  const passwordField = document.querySelector("[data-passwordField]") as HTMLInputElement;
  const submitButton: HTMLElement | null = document.querySelector("[data-submitButton]");
  const registerForm = document.querySelector("[data-registerForm]") as HTMLFormElement;

  if (!eyeIcon || !passwordField) return;

  if (eyeIconButton) {
    eyeIconButton.addEventListener("click", () => togglePasswordVisibility(eyeIcon, eyeIconButton, passwordField));
  }

  if (submitButton) {
    submitButton.addEventListener("click", (e) => handleFormSubmit(e, registerForm));
  }
};

export default initRegisterPage;
