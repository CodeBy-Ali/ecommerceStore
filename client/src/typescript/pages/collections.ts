import { handleAddToCart } from "../components/utils/cartUtils";

const initCollectionPage = (): void => {
  const addToCartButtons = document.querySelectorAll<HTMLElement>(
    "[data-add-to-cart-btn]"
  );
  addToCartButtons?.forEach((button) =>
    button.addEventListener("click", handleAddToCart)
  );
};

export default initCollectionPage;
