import initAccordion from "../components/accordion/accordion";
import DOMUtils from "../components/utils/domUtils";
import {
  extractFormData,
  IFormData,
  logErrorWithNotification,
  submitForm,
} from "../components/utils/pagesUtils";
import isFormValid from "../components/validator/validator";
import { IRegisterReqBody } from "./register";


export interface IShippingAddress extends IFormData{
  address: string;
  city: string;
  province: string;
  phone: string;
  apartment?: string;
  postalCode?: string;
  country: string,
}

interface ICheckoutForm extends Omit<IRegisterReqBody, "password">,IShippingAddress {
  paymentMethod: string;
  password?: string;
  saveCheckout: boolean;
  cartId: string;
}

interface ICheckoutReqBody extends IFormData {
  cartId: string;
}

// TODO change the default selection of shippings address based on selection
// TODO toggle 'show' text to 'hide' in show order summary accordion on mouse click
// TODO add default country pakistan in checkout form

const initCheckoutPage = () => {
  initAddShippingAddressPopUp();
  initAccordions();
  initCheckoutForm();
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


// TODO replace the formData interface with more type safe one
function handleNewAddressSubmit(e: Event) {
  const formSubmitButton = e.currentTarget as HTMLButtonElement;
  const form =
    DOMUtils.getElement<HTMLFormElement>("[data-new-shipping-address-form]") ||
    formSubmitButton.closest("form");
  if (!form)
    return logErrorWithNotification("Save shipping address form in undefined");

  if (!isFormValid(form)) return;
  const userEmail = DOMUtils.getElement<HTMLElement>("[data-user-email]")?.textContent;
  if (!userEmail) return logErrorWithNotification("User email is undefined can't complete add shipping address request");
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

function initAccordions() {
  const accordions = document.querySelectorAll<HTMLElement>("[data-accordion]");
  accordions.forEach(initAccordion);
}

function initCheckoutForm() {
  const completeOrderBtn = DOMUtils.getElement<HTMLElement>(
    "button[data-complete-order-button]"
  );
  const shippingAddresses = document.querySelectorAll<HTMLElement>("ul[data-shipping-addresses-list] > li");
  shippingAddresses.forEach(addressElement => addressElement.addEventListener("click", showCurrentSelectedAddress));

  if (completeOrderBtn)
    completeOrderBtn.addEventListener("click", handleCheckoutFormSubmit);
}

function showCurrentSelectedAddress(e:Event) {
  const selectedAddressElement = e.currentTarget as HTMLElement;
  if (selectedAddressElement.tagName !== "LI") return;
  const selectedAddressText = selectedAddressElement.textContent?.trim()?.replaceAll(/\s{2,}/g, ", ") || null;
  const selectedAddressContainer = DOMUtils.getElement<HTMLElement>("[data-selected-address-container]");
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

  if (!isFormValid(checkOutForm)) return;

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
  console.log(checkoutReqBody);
  submitForm<ICheckoutReqBody>("/orders", checkoutReqBody);
}

export default initCheckoutPage;
