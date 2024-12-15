import { productImageSlider, additionalProductSlider } from "../components/imageSlider/imageSlider";
import DOMUtils from "../components/utils/domUtils";
import { handleAddToCartClick, updateItemQuantity } from "../components/utils/cartUtils";
import initAccordion from "../components/accordion/accordion";

const initProductPage = () => {
  const addToCartButtons = document.querySelectorAll<HTMLElement>("[data-add-to-cart-btn]");
  const productAccordion = DOMUtils.getElement<HTMLElement>("[data-product-accordion]");
  
  addToCartButtons?.forEach((button) => button.addEventListener("click", handleAddToCartClick));

  if(productAccordion) initAccordion(productAccordion);
  productQuantitySpinner();
  productImageSlider();
  additionalProductSlider(); 
};


function productQuantitySpinner() {
  const productQuantityContainer = DOMUtils.getElement<HTMLDivElement>("[data-product-quantity-wrapper]");
  if (!productQuantityContainer) return;

  ["click", "input"].forEach((event) =>
    productQuantityContainer.addEventListener(event, (e) => {
      e.preventDefault();
      const clickedElement = e.target as HTMLElement;
      const quantityInputFiled = productQuantityContainer.querySelector<HTMLInputElement>("input[data-product-quantity-input]");

      if (!quantityInputFiled) return;
      if (e.type === "click" && clickedElement.tagName === "INPUT") return;

      updateItemQuantity(productQuantityContainer, clickedElement, quantityInputFiled);
    })
  );
}

export default initProductPage;
