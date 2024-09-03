import initAccordion from "../components/accordion/accordion";
import DOMUtils from "../components/utils/domUtils";

const initCheckoutPage = () => {
  const orderSummaryAccordion = DOMUtils.getElement<HTMLDivElement>("div[data-order-summary-accordion]");
  const paymentAccordion = DOMUtils.getElement<HTMLElement>("[data-payment-accordion]");
  if (orderSummaryAccordion) initAccordion(orderSummaryAccordion);
  if (paymentAccordion) initAccordion(paymentAccordion);
};


export default initCheckoutPage;
