import { showNotification, togglePasswordVisibility } from "../components/utils/util";
import isFormValid from "../components/validator/validator";

const handleFormSubmit = async (e: Event, signInForm: HTMLFormElement): Promise<void> => {
  e.preventDefault();

  if (!signInForm || signInForm.elements.length < 2) {
    throw new Error("SingIn form elements are missing or form is invalid");
  }

  if (!isFormValid(signInForm)) return;

  const emailField = document.querySelector<HTMLInputElement>(`[data-emailField]`);
  const passwordField = document.querySelector<HTMLInputElement>(`[data-passwordField]`);

  try {
    const response = await fetch("/account/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
const initLoginPage = (): void => {
  const eyeIconButton: HTMLElement | null = document.querySelector("[data-eyeIconButton]");
  const eyeIcon = document.querySelector(".eye_icon") as HTMLElement;
  const passwordField = document.querySelector("[data-passwordField]") as HTMLInputElement;
  const signInButton: HTMLElement | null = document.querySelector("[data-signInButton]");
  const signInForm = document.querySelector("[data-signInForm]") as HTMLFormElement;

  if (!eyeIcon || !passwordField) return;

  if (eyeIconButton) {
    eyeIconButton.addEventListener("click", () => togglePasswordVisibility(eyeIcon, eyeIconButton, passwordField));
  }

  if (signInButton) {
    signInButton.addEventListener("click", (e) => handleFormSubmit(e, signInForm));
  }
};

export default initLoginPage;
