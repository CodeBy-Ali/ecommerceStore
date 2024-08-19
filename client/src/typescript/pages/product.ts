import { productImageSlider, additionalProductSlider } from "../components/imageSlider/imageSlider";
import DOMUtils from "../components/utils/domUtils";
import { addProductToCart } from "../components/Cart/cart";
import { updateItemQuantity } from "../components/utils/cartUtils";
import { showNotification } from "../components/utils/pagesUtils";

const initProductPage = () => {
  const addToCartButtons = document.querySelectorAll<HTMLElement>("[data-addToCartBtn]");
  addToCartButtons?.forEach((button) => button.addEventListener("click", handleAddToCartClick));
  productQuantitySpinner();
  productImageSlider();
  additionalProductSlider();
};

export function handleAddToCartClick(e:Event) {
  const actionButton = e.target as HTMLButtonElement;
  const productId = actionButton.getAttribute('data-productId');
  const quantityInputFiled = document.querySelector<HTMLInputElement>("input[data-product-quantity-input]");
  if (!quantityInputFiled) return;
  if (!productId) {
    showNotification("Failed to add product to cart. Please try again later..", false);
    throw new Error("Missing required argument: ProductId");
  }
  const quantity = Number(quantityInputFiled.value);
  addProductToCart(actionButton, productId, quantity);
}

function productQuantitySpinner() {
  const productQuantityContainer = DOMUtils.getElement<HTMLDivElement>("[data-product-quantity-wrapper]");
  if (!productQuantityContainer) return;

  ["click", "input"].forEach((event) =>
    productQuantityContainer.addEventListener(event, (e) => {
      const clickedElement = e.target as HTMLElement;
      const quantityInputFiled = productQuantityContainer.querySelector<HTMLInputElement>("input[data-product-quantity-input]");

      if (!quantityInputFiled) return;
      if (e.type === "click" && clickedElement.tagName === "INPUT") return;

      updateItemQuantity(productQuantityContainer, clickedElement, quantityInputFiled);
    })
  );
}

export default initProductPage;
