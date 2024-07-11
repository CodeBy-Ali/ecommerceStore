import DOMUtils from "../utils/domUtils";

interface IRules {
  firstName: (value: string) => boolean;
  lastName: (value: string) => boolean;
  email: (value: string) => boolean;
  password: (value: string) => boolean;
}

const validatorRules: IRules = {
  firstName: (name: string): boolean => /^[a-zA-Z]+(?:[ \-'][a-zA-Z]+)*$/.test(name),
  lastName: (name: string): boolean => /^[a-zA-Z]+(?:[ \-'][a-zA-Z]+)*$/.test(name),
  email: (email: string): boolean => /^(?!.*\.\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
  password: (password: string): boolean => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}/.test(password),
};

const showValidationError = (element: HTMLElement | null) => {
  if (!element) return;
  DOMUtils.addClass(element, "validationFailed");
  element.addEventListener("input", () => {
    DOMUtils.removeClass(element, "validationFailed");
  });
};

const isFormValid = (form: HTMLFormElement): boolean => {
  let isValid = true;
  const elements = Array.from(form?.elements) as HTMLFormElement[];

  elements.forEach((element) => {
    if (element instanceof HTMLInputElement) {
      const inputFieldName = element?.name as keyof IRules;
      const validate = validatorRules[inputFieldName];
      const isFieldValid = validate(element.value);
      if (!isFieldValid) {
        isValid = false;
        showValidationError(element.parentElement);
      }
    }
  });

  return isValid;
};

export default isFormValid;
