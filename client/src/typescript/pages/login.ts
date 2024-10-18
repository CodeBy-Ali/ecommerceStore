import DOMUtils from "../components/utils/domUtils";
import {
  showNotification,
  togglePasswordVisibility,
} from "../components/utils/pagesUtils";
import areFormElementsValid from "../components/validator/validator";

export interface ISignInReqBody {
  email: string;
  password: string;
  returnTo?:string,
}

export const submitLoginForm = async (
  formElements: HTMLInputElement[],
  returnTo?:string,
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
  const eyeIconButton: HTMLElement | null = document.querySelector(
    "[data-eyeIconButton]"
  );
  const eyeIcon = document.querySelector(".eye_icon") as HTMLElement;
  const passwordField = document.querySelector(
    "[data-password]"
  ) as HTMLInputElement;
  const signInButton: HTMLElement | null = DOMUtils.getElement<HTMLButtonElement>('[data-signIn-button]')
  const signInForm = document.querySelector(
    "[data-signInForm]"
  ) as HTMLFormElement;

  if (!eyeIcon || !passwordField) return;

  if (eyeIconButton) {
    eyeIconButton.addEventListener("click", () =>
      togglePasswordVisibility(eyeIcon, eyeIconButton, passwordField)
    );
  }

  if (signInButton) {
    signInButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (!signInForm || signInForm.elements.length < 2) {
        throw new Error("SingIn form elements are missing or form is invalid");
      }
      const formElements = Array.from(
        signInForm.elements
      ) as HTMLInputElement[];
      submitLoginForm(formElements);
    });
  }
};

export default initLoginPage;
