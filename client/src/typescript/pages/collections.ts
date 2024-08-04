import { showNotification } from "../components/utils/util";
import { renderCart } from "../components/Cart/modules/cartRender";
import { IResponseBody } from "../components/Cart/cart";
import Cart from "../components/Cart/cart";
import {
  withProcessingState,
  updateHeaderTotalCartItemsCount,
  toggleCartDrawer,
} from "../components/utils/cartUtils";








const addProductToCart: (e: Event) => Promise<void> = withProcessingState(async (e: Event) => {
  const targetButton = e.target as HTMLElement;
  if (!targetButton) return;
  const productId = targetButton.getAttribute("data-productId");
  if (!productId) throw new Error("Failed to get ProductId");
  const response = await fetch("/cart/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ productId: productId }),
  });
  const responseBody = await response.json();
  if (!response.ok) {
    showNotification(responseBody?.message, false);
    return;
  }
  const { cartItems, storeSettings } = responseBody as IResponseBody;
  const totalCartItems = cartItems.reduce((total, { quantity }) => (total += quantity), 0);
  renderCart(cartItems, totalCartItems, storeSettings);
  updateHeaderTotalCartItemsCount(totalCartItems);
  toggleCartDrawer();
  Cart();
});





const initCollectionPage = (): void => {
  const addToCartButtons = document.querySelectorAll<HTMLElement>("[data-addToCartBtn]");
  addToCartButtons?.forEach(button => button.addEventListener("click", addProductToCart));
}

export default initCollectionPage;