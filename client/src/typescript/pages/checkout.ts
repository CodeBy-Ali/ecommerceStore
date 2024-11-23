import initAccordion from "../components/accordion/accordion";
import DOMUtils from "../components/utils/domUtils";
import {
  extractFormData,
  IFormData,
  initPasswordVisibilityToggle,
  logErrorWithNotification,
  submitForm,
} from "../components/utils/pagesUtils";
import areFormElementsValid from "../components/validator/validator";
import { submitLoginForm } from "./login";
import { IRegisterReqBody } from "./register";

export interface IShippingAddress extends IFormData {
  address: string;
  city: string;
  province: string;
  phone: string;
  apartment?: string;
  postalCode?: string;
  country: string;
}

interface ICheckoutForm
  extends Omit<IRegisterReqBody, "password">,
    IShippingAddress {
  paymentMethod: string;
  password?: string;
  saveCheckout: boolean;
  cartId: string;
}

interface ICheckoutReqBody extends IFormData {
  cartId: string;
}
const initCheckoutPage = () => {
  initAddShippingAddressPopUp();
  initAccordions();
  initCheckoutForm();
  initAccountLogin();
  addPasswordVisibilityToggle()
};

function initAddShippingAddressPopUp() {
  const addAddressButton = DOMUtils.getElement<HTMLButtonElement>(
    "[data-add-shipping-address-btn]"
  );
  const closeAddressPopUpButton = DOMUtils.getElement<HTMLButtonElement>(
    "[data-close-pop-up-button]"
  );
  const saveAddressButton = DOMUtils.getElement<HTMLButtonElement>(
    "[data-save-shipping-address-button]"
  );

  addAddressButton?.addEventListener("click", toggleAddAddressPopUp);
  closeAddressPopUpButton?.addEventListener("click", toggleAddAddressPopUp);
  saveAddressButton?.addEventListener("click", handleNewAddressSubmit);
}

function initAccordions() {
  const accordions = document.querySelectorAll<HTMLElement>("[data-accordion]");
  accordions.forEach(initAccordion);
}

function initCheckoutForm() {
  const completeOrderBtn = DOMUtils.getElement<HTMLElement>(
    "button[data-complete-order-button]"
  );
  const shippingAddresses = document.querySelectorAll<HTMLElement>(
    "ul[data-shipping-addresses-list] > li"
  );
  shippingAddresses.forEach((addressElement) =>
    addressElement.addEventListener("click", showCurrentSelectedAddress)
  );

  if (completeOrderBtn)
    completeOrderBtn.addEventListener("click", handleCheckoutFormSubmit);
}

function initAccountLogin() {
  const loginButton = DOMUtils.getElement<HTMLButtonElement>(
    "button[data-checkout-account-login]"
  );
  loginButton?.addEventListener("click", handleLoginRequest);
}


function addPasswordVisibilityToggle() {
  const togglePasswordBtn = DOMUtils.getElement<HTMLButtonElement>("[data-eyeIconButton]");
  const passwordField = DOMUtils.getElement<HTMLInputElement>("input[data-password]");
  if (!togglePasswordBtn || !passwordField) return;
  initPasswordVisibilityToggle(togglePasswordBtn, passwordField);
}


// TODO replace the formData interface with more type safe one
function handleNewAddressSubmit(e: Event) {
  const formSubmitButton = e.currentTarget as HTMLButtonElement;
  const form =
    DOMUtils.getElement<HTMLFormElement>("[data-new-shipping-address-form]") ||
    formSubmitButton.closest("form");
  if (!form)
    return logErrorWithNotification("Save shipping address form in undefined");

  const formElements = Array.from(form.elements) as HTMLInputElement[];
  if (!areFormElementsValid(formElements)) return;
  const userEmail =
    DOMUtils.getElement<HTMLElement>("[data-user-email]")?.textContent;
  if (!userEmail)
    return logErrorWithNotification(
      "User email is undefined can't complete add shipping address request"
    );
  const formData = extractFormData(form);
  formData.email = userEmail;
  submitForm("/account/shippingAddress", formData);
}

function toggleAddAddressPopUp() {
  const overLay = document.querySelector<HTMLElement>("[data-overLay]");
  const popUp = DOMUtils.getElement<HTMLElement>(
    "[data-add-shipping-address-pop-up]"
  );
  const body = document.querySelector<HTMLElement>("body");

  body && DOMUtils.toggleClass(body, "hideOverflow");
  popUp && DOMUtils.toggleClass(popUp, "show");
  overLay && DOMUtils.toggleClass(overLay, "active");
}

function showCurrentSelectedAddress(e: Event) {
  const selectedAddressElement = e.currentTarget as HTMLElement;
  if (selectedAddressElement.tagName !== "LI") return;
  const selectedAddressText =
    selectedAddressElement.textContent?.trim()?.replaceAll(/\s{2,}/g, ", ") ||
    null;
  const selectedAddressContainer = DOMUtils.getElement<HTMLElement>(
    "[data-selected-address-container]"
  );
  if (!selectedAddressContainer) return;
  selectedAddressContainer.textContent = selectedAddressText;
}

function handleCheckoutFormSubmit(e: Event) {
  e.preventDefault();
  e.stopPropagation();
  const completeOrderBtn = e.currentTarget as HTMLButtonElement;
  const checkOutForm =
    DOMUtils.getElement<HTMLFormElement>("form[data-checkout-form-main]") ||
    completeOrderBtn.closest("form");
  if (!checkOutForm)
    return logErrorWithNotification("CheckOutForm in undefined");

  const formElements = Array.from(checkOutForm.elements) as HTMLInputElement[];
  if (!areFormElementsValid(formElements)) return;

  const cartIdElement = DOMUtils.getElement<HTMLInputElement>(
    ".order_summary_container  input[data-cart-id]"
  );

  const cartId = cartIdElement?.value;
  if (!cartId)
    return logErrorWithNotification(
      "Failed to submit checkout form due to missing user cart id"
    );

  const formData = extractFormData(checkOutForm);

  const checkoutReqBody: ICheckoutReqBody = {
    cartId,
    ...formData,
  };
  submitForm<ICheckoutReqBody>("/orders", checkoutReqBody);
}

async function handleLoginRequest() {
  const emailField = DOMUtils.getElement<HTMLInputElement>(`input[data-email]`);
  const passwordField =
    DOMUtils.getElement<HTMLInputElement>(`input[data-password]`);
  if (!emailField || !passwordField) return;
  await submitLoginForm([emailField,passwordField],"/checkout")
}

export default initCheckoutPage;
