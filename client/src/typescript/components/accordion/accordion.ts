import DOMUtil from "../utils/domUtils";

const closeNonSelectedOpenAccordions = (accordions: HTMLElement[], accordionButtons: HTMLElement[]): void => {
  accordions.forEach((accordion, index) => {
    DOMUtil.removeClass(accordion, "active");
    const accordionButton: HTMLElement | null = accordionButtons[index];
    if (accordionButton && DOMUtil.checkAttributeValue(accordionButton, "aria-expanded", "true")) {
      DOMUtil.toggleAttributeBoolean(accordionButton, "aria-expanded");
    }
  });
};

const toggleCurrentAccordion = (accordion: HTMLElement, accordionButton: HTMLElement): void => {
  DOMUtil.toggleClass(accordion, "active");
  DOMUtil.toggleAttributeBoolean(accordionButton, "aria-expanded");
};

const initAccordion = (): void => {
  const accordionButtons: NodeListOf<HTMLElement> = document.querySelectorAll("[data-accordionBtn]");

  if (accordionButtons.length < 1) return;

  accordionButtons.forEach((button: HTMLElement) => {
    button.addEventListener("click", (): void => {
      const nonSelectedAccordionButtons: Array<HTMLElement> = Array.from(accordionButtons).filter((accordionButton) => accordionButton !== button);

      if (nonSelectedAccordionButtons.length < 1) return;

      const nonSelectedAccordions: Array<HTMLElement> = nonSelectedAccordionButtons.map((accordionButton) => accordionButton?.parentElement).filter((parent) => parent !== null);

      if (nonSelectedAccordions.length < 1) return;

      closeNonSelectedOpenAccordions(nonSelectedAccordions, nonSelectedAccordionButtons);

      const currentAccordion: HTMLElement | null = button.parentElement;
      if (currentAccordion) toggleCurrentAccordion(currentAccordion, button);
    });
  });
};

export default initAccordion;
