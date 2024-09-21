import DOMUtils from "../utils/domUtils";

interface IRules {
  firstName: (value: string) => boolean;
  lastName: (value: string) => boolean;
  email: (value: string) => boolean;
  password: (value: string) => boolean;
  phone: (value: string) => boolean; 
  address: (value: string) => boolean;
  city: (value: string) => boolean;
  province: (value: string) => boolean;
}

const validatorRules: IRules = {
  firstName: (name: string): boolean => /^[a-zA-Z]+(?:[ \-'][a-zA-Z]+)*$/.test(name),
  lastName: (name: string): boolean => /^[a-zA-Z]+(?:[ \-'][a-zA-Z]+)*$/.test(name),
  email: (email: string): boolean => /^(?!.*\.\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
  password: (password: string): boolean => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}/.test(password),
  phone: (phone: string): boolean => /^(\+?\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4,5}$/.test(phone),
  address: (address: string): boolean => /[\w\-,\/',\s\\^]/.test(address),
  city: (city: string): boolean => /^[a-zA-Z]+\-?[a-zA-Z\s]+$/.test(city),
  province: (state: string): boolean => /^[a-zA-Z]+\-?[a-zA-Z\s]+$/.test(state),
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
  const formElements = Array.from(form?.elements) as HTMLElement[];

  for (const element of formElements) {
    if (!(element instanceof HTMLInputElement)) continue;
    if (element.type === "radio" || element.type === "checkbox") continue;

    const inputFieldName = element?.name as keyof IRules;
    const validate = validatorRules[inputFieldName];
    if (!validate) continue; // skip validation for elements with missing rules
    const isFieldValid = validate(element.value);
    if (!isFieldValid) {
      isValid = false;
      console.log(inputFieldName,element.value)
      showValidationError(element.parentElement);
    }
  }
  
  return isValid;
};

export default isFormValid;
