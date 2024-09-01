import DOMUtils from "../components/utils/domUtils";

const initCheckoutPage = () => {
  initOrderSummaryAccordion();
}


function initOrderSummaryAccordion() {
  const summaryButton = document.querySelector<HTMLButtonElement>('button[data-order-summary-button]');
  const accordionContainer = DOMUtils.getElement<HTMLElement>("div[data-order-summary-detail]");
  const summaryButtonTextElement = DOMUtils.getElement<HTMLSpanElement>("span[data-checkout-summary-button-text]");

  if (!accordionContainer || !summaryButton) return;
  summaryButton.addEventListener('click', () => {
    DOMUtils.toggleClass(accordionContainer, 'open');
    DOMUtils.toggleClass(summaryButton, 'open');
    const maxHeight = accordionContainer.style.maxHeight.match(/\d+/)?.[0];
    if (maxHeight && Number(maxHeight) > 0) {
      accordionContainer.style.maxHeight = '0px';
      DOMUtils.addTextContent(summaryButtonTextElement, 'Show order Summary');
    } else {
      DOMUtils.addTextContent(summaryButtonTextElement, 'Hide order Summary');
      accordionContainer.style.maxHeight = accordionContainer.scrollHeight + 'px';
    }
  })
}
export default initCheckoutPage;