import DOMUtils from "../utils/domUtils";

const initAccordion = (accordion: HTMLElement): void => {
  const accordionButtons = accordion.querySelectorAll<HTMLButtonElement>("button[data-accordion-button]");
  accordionButtons.forEach((button) =>
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetElement = e.target as HTMLElement;
      if (targetElement.tagName === "INPUT") return; // return if event is triggered by label element
      const nonSelectedAccordionButtons: Array<HTMLElement> = Array.from(accordionButtons).filter((accordionButton) => accordionButton !== button);
      const nonSelectedAccordionItems: Array<HTMLElement> = nonSelectedAccordionButtons.map((accordionButton) => accordionButton?.parentElement).filter((parent) => parent !== null);
      toggleAccordionState(e);
      closeNonSelectedOpenAccordionItems(nonSelectedAccordionItems);
    })
  );
};

function toggleAccordionState(e: Event) {
  const accordionButton = e.currentTarget as HTMLButtonElement;
  const accordionBody = accordionButton.parentElement?.querySelector<HTMLElement>("[data-accordion-body]");
  if (!accordionBody || !accordionButton) return;
  DOMUtils.toggleClass(accordionBody, "open");
  DOMUtils.toggleClass(accordionButton, "open");

  const maxHeight = accordionBody.style.maxHeight.match(/\d+/)?.[0];
  if (maxHeight && Number(maxHeight) > 0) {
    accordionBody.style.maxHeight = "0px";
  } else {
    accordionBody.style.maxHeight = accordionBody.scrollHeight + "px";
  }
}

function closeNonSelectedOpenAccordionItems(accordionItems: HTMLElement[]): void {
  accordionItems.forEach((accordionItem) => {
    const accordionButton = accordionItem.querySelector<HTMLButtonElement>("button[data-accordion-button]");
    const accordionBody = accordionItem.querySelector<HTMLElement>("[data-accordion-body]");
    if (!accordionBody || !accordionButton) return;
    DOMUtils.removeClass(accordionBody, "open");
    DOMUtils.removeClass(accordionButton, "open");

    accordionBody.style.maxHeight = "0px";
    
    if (accordionButton && DOMUtils.checkAttributeValue(accordionButton, "aria-expanded", "true")) {
      DOMUtils.toggleAttributeBoolean(accordionButton, "aria-expanded");
    }
  });
}

export default initAccordion;
