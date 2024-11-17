import DOMUtils from "./domUtils";
import {
  enterProcessingState,
  exitProcessingState,
  showNotification,
} from "./pagesUtils";
import { addProductToCart, ICartItem } from "../Cart/cart";

// closes and opens the cart menu
export const toggleCartDrawer = (): void => {
  const cartDrawer = document.querySelector<HTMLElement>("[data-cartDrawer]");
  const body = document.querySelector<HTMLElement>("body");
  const overLay = document.querySelector<HTMLElement>("[data-overLay]");

  body && DOMUtils.toggleClass(body, "hideOverflow");
  cartDrawer && DOMUtils.toggleClass(cartDrawer, "open");
  overLay && DOMUtils.toggleClass(overLay, "active");
};

export const getTotalCartItemsQuantity = (items: ICartItem[]): number => {
  return items.reduce((total, { quantity }) => (total += quantity), 0);
};

export const updateHeaderTotalCartItemsCount = (
  totalCartItems: number
): void => {
  const cartQuantityContainer = document.querySelector<HTMLElement>(
    "header span[data-headerCartQuantity]"
  );
  DOMUtils.addTextContent(cartQuantityContainer, totalCartItems);
};

/* -increases or decreases the quantity based on the button clicked
   -keeps the quantity with in the stock range
   -Defaults to minimum quantity if quantity is below the minimum range
   -Defaults to max stock  if entered quantity is greater than available stock
*/
export const updateItemQuantity = (
  quantityContainer: HTMLDivElement,
  clickedElement: HTMLElement,
  quantityInputField: HTMLInputElement
): number | null => {
  const minQuantity = Number(quantityInputField?.min);
  const itemStock = Number(quantityInputField?.max);
  if (quantityInputField.value.length < 1) return null;
  const itemQuantity = Number(
    quantityInputField?.value.replaceAll(/[\s-]/g, "")
  );
  const increase =
    clickedElement.getAttribute("data-counter-type") === "increase";
  const decrease =
    clickedElement.getAttribute("data-counter-type") === "decrease";

  const updatedQuantity = increase
    ? Math.min(itemQuantity + 1, itemStock)
    : decrease
    ? Math.max(itemQuantity - 1, minQuantity)
    : itemQuantity > itemStock
    ? itemStock
    : itemQuantity < minQuantity
    ? minQuantity
    : itemQuantity;

  renderUpdatedQuantity(updatedQuantity, quantityInputField);
  limitQuantityToStock(quantityContainer, quantityInputField);
  return updatedQuantity;
};

export const getCartQuantityInputField = (
  quantityContainer: HTMLDivElement
): HTMLInputElement | null => {
  const cartItem = quantityContainer.closest(
    "li[data-item-id]"
  ) as HTMLLIElement | null;
  if (!cartItem) {
    console.log(`Element with selector 'li[data-item-id]' not found`);
    return null;
  }
  const itemId = cartItem?.getAttribute("data-item-id");
  if (!itemId) {
    console.log("Item Id attribute is missing or is Invalid");
    return null;
  }
  return DOMUtils.getElement<HTMLInputElement>(
    `li[data-item-id="${itemId}"] input[data-key="${itemId}"]`
  );
};

export const getCartItemId = (
  quantityContainer: HTMLDivElement
): string | null => {
  const cartItem = quantityContainer.closest(
    "li[data-item-id]"
  ) as HTMLLIElement | null;
  if (!cartItem) {
    console.log(`Element with selector 'li[data-item-id]' not found`);
    return null;
  }
  return cartItem.getAttribute("data-item-id");
};

export const renderUpdatedQuantity = (
  updatedQuantity: number,
  quantityInputField: HTMLInputElement
) => {
  quantityInputField.value = updatedQuantity.toString();
};

export const limitQuantityToStock = (
  quantityContainer: HTMLDivElement,
  quantityInputField: HTMLInputElement
) => {
  const increaseButton = quantityContainer.querySelector<HTMLButtonElement>(
    `[data-counter-type="increase"]`
  );
  const decreaseButton = quantityContainer.querySelector<HTMLButtonElement>(
    `[data-counter-type="decrease"]`
  );
  const itemStock = Number(quantityInputField?.max);
  const minQuantity = Number(quantityInputField?.min);
  const itemQuantity = Number(quantityInputField?.value);
  if (increaseButton) increaseButton.disabled = itemQuantity >= itemStock;
  if (decreaseButton) decreaseButton.disabled = itemQuantity <= minQuantity;
};

export function withProcessingState(
  fn: (productId: string, quantity: number) => Promise<void>
) {
  return async (
    actionButton: HTMLButtonElement,
    productId: string,
    quantity: number
  ): Promise<void> => {
    actionButton && enterProcessingState(actionButton);
    if (!quantity) quantity = 1;
    try {
      if (!productId) throw new Error("Missing required argument: ProductId");
      await fn(productId, quantity);
    } catch (error) {
      console.log(error);
      showNotification(
        "Failed to add product to cart. Please try again later..",
        false
      );
    } finally {
      actionButton && exitProcessingState(actionButton);
    }
  };
};

export function handleAddToCart(e: Event): void {
  const actionButton = e.target as HTMLButtonElement;
  const productId = actionButton
    .closest("form")
    ?.querySelector<HTMLInputElement>('input[name="productId"]')?.value;
  console.log("Product Id",productId);
  const productQuantity = 1;
  if (!productId) {
    showNotification(
      "Failed to add product to cart. Please try again later..",
      false
    );
    throw new Error("Missing required argument: ProductId");
  }
  addProductToCart(actionButton, productId, productQuantity);
}
