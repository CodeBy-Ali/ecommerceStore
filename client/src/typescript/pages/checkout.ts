import initAccordion from "../components/accordion/accordion";
import DOMUtils from "../components/utils/domUtils";
import isFormValid from "../components/validator/validator";

// TODO toggle 'show' text to 'hide' in show order summary accordion on mouse click
const initCheckoutPage = () => {
  const orderSummaryAccordion = DOMUtils.getElement<HTMLDivElement>("div[data-order-summary-accordion]");
  const paymentAccordion = DOMUtils.getElement<HTMLElement>("[data-payment-accordion]");
  const completeOrderBtn = DOMUtils.getElement<HTMLElement>('button[data-complete-order-button]');

  if (orderSummaryAccordion) initAccordion(orderSummaryAccordion);
  if (paymentAccordion) initAccordion(paymentAccordion);
  if (completeOrderBtn) completeOrderBtn.addEventListener('click', handleCheckoutFormSubmit);
};


function handleCheckoutFormSubmit(e:Event) {
  e.preventDefault();
  const completeOrderBtn = e.currentTarget as HTMLButtonElement;
  const checkOutForm = DOMUtils.getElement<HTMLFormElement>('form[data-checkout-form]') || completeOrderBtn.closest('form');
  if (!checkOutForm) return console.log('CheckOutForm in undefined');

  // const inputElements = Array.from(checkOutForm.elements) as HTMLElement[];
  // inputElements.forEach(element => {
  //   if (element instanceof HTMLInputElement) {
  //     if (element.type === 'radio' && element.checked) {
  //       console.log(element);
  //     }
  //   }
  // })
  if (!isFormValid(checkOutForm)) return;
}


export default initCheckoutPage;
