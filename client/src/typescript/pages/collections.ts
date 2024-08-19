import { addProductToCart } from "../components/Cart/cart";
import { showNotification } from "../components/utils/pagesUtils";

const initCollectionPage = (): void => {
  const addToCartButtons = document.querySelectorAll<HTMLElement>("[data-addToCartBtn]");
  addToCartButtons?.forEach((button) => button.addEventListener("click", handleAddToCart));
};

function handleAddToCart(e:Event):void { 
    const actionButton = e.target as HTMLButtonElement;
    const productId = actionButton.getAttribute("data-productId");
    if (!productId) {
      showNotification("Failed to add product to cart. Please try again later..", false);
      throw new Error("Missing required argument: ProductId");
    }
    addProductToCart(actionButton, productId, 1);
}

export default initCollectionPage;
