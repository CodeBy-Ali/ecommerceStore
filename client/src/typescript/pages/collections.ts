import { addProductToCart } from "../components/Cart/cart";
import { showNotification } from "../components/utils/pagesUtils";

const initCollectionPage = (): void => {
  const addToCartButtons = document.querySelectorAll<HTMLElement>("[data-add-to-cart-btn]");
  addToCartButtons?.forEach((button) => button.addEventListener("click", handleAddToCart));
};

function handleAddToCart(e: Event): void {
  const actionButton = e.target as HTMLButtonElement;
  const productId = actionButton.closest("form")?.querySelector<HTMLInputElement>('input[name="productId"]')?.value;
  const productQuantity = 1;
  if (!productId) {
    showNotification("Failed to add product to cart. Please try again later..", false);
    throw new Error("Missing required argument: ProductId");
  }
  addProductToCart(actionButton, productId, productQuantity);
}

export default initCollectionPage;
