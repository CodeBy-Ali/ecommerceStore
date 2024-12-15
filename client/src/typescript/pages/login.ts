import AsyncButton from "../components/asyncButton/asyncButton";
import DOMUtils from "../components/utils/domUtils";
import {
  initPasswordVisibilityToggle,
  showNotification,
} from "../components/utils/pagesUtils";
import areFormElementsValid from "../components/validator/validator";

export interface ISignInReqBody {
  email: string;
  password: string;
  returnTo?: string;
}

export const submitLoginForm = async (
  formElements: HTMLInputElement[],
  returnTo?: string
): Promise<void> => {
  if (!areFormElementsValid(formElements)) return;

  const emailField =
    document.querySelector<HTMLInputElement>(`input[data-email]`);
  const passwordField =
    document.querySelector<HTMLInputElement>(`input[data-password]`);

  if (!emailField || !passwordField) return;

  const signInReqBody: ISignInReqBody = {
    email: emailField?.value,
    password: passwordField?.value,
  };

  if (returnTo) signInReqBody.returnTo = returnTo;

  try {
    const response = await fetch("/account/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signInReqBody),
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
  const eyeIconButton = document.querySelector<HTMLButtonElement>(
    "[data-eyeIconButton]"
  );
  const passwordField = document.querySelector(
    "[data-password]"
  ) as HTMLInputElement;
  const signInButton: HTMLButtonElement | null =
    DOMUtils.getElement<HTMLButtonElement>("[data-signIn-button]");
  const signInForm = document.querySelector(
    "[data-signInForm]"
  ) as HTMLFormElement;

  if (!passwordField || !eyeIconButton) return;

  initPasswordVisibilityToggle(eyeIconButton, passwordField);

  if (!signInButton) return;

  signInButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (!signInForm || signInForm.elements.length < 2) {
      throw new Error("SingIn form elements are missing or form is invalid");
    }
    const formElements = Array.from(signInForm.elements) as HTMLInputElement[];
    const asyncButton = new AsyncButton(signInButton);
    asyncButton.withProcessingState(submitLoginForm, [formElements]);
  });
};

export default initLoginPage;
