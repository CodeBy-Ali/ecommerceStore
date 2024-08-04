import DOMUtils from "./domUtils";
import { enterProcessingState, exitProcessingState, showNotification } from "./util";

// closes and opens the cart menu
export const toggleCartDrawer = (): void => {
  const cartDrawer = document.querySelector<HTMLElement>("[data-cartDrawer]");
  const body = document.querySelector<HTMLElement>("body");
  const overLay = document.querySelector<HTMLElement>("[data-overLay]");

  body && DOMUtils.toggleClass(body, "hideOverflow");
  cartDrawer && DOMUtils.toggleClass(cartDrawer, "open");
  overLay && DOMUtils.toggleClass(overLay, "active");
};

export const updateHeaderTotalCartItemsCount = (totalCartItems: number): void => {
  const cartQuantityContainer = document.querySelector<HTMLElement>("header span[data-headerCartQuantity]");
  DOMUtils.addTextContent(cartQuantityContainer, totalCartItems);
};

export const getUpdatedQuantity = (clickedElement: HTMLElement, quantityInputField: HTMLInputElement): number | undefined => {
  const itemStock = Number(quantityInputField?.max);
  const minQuantity = Number(quantityInputField?.min);

  if (quantityInputField.value.length < 1) {
    return;
  }

  const itemQuantity = Number(quantityInputField?.value.replaceAll(/[\s-]/g, ""));
  const increase = clickedElement.matches("[data-increase-item-quantity]");
  const decrease = clickedElement.matches("[data-decrease-item-quantity]");

  const updatedQuantity = increase ? Math.min(itemQuantity + 1, itemStock) : decrease ? Math.max(itemQuantity - 1, minQuantity) : itemQuantity > itemStock ? itemStock : itemQuantity < minQuantity ? minQuantity : itemQuantity;

  return updatedQuantity;
};

export const getCartQuantityInputField = (quantityContainer: HTMLDivElement): HTMLInputElement | null => {
  const cartItem = quantityContainer.closest("li[data-item-id]") as HTMLLIElement | null;
  if (!cartItem) {
    console.log(`Element with selector 'li[data-item-id]' not found`);
    return null;
  }
  const itemId = cartItem?.getAttribute("data-item-id");
  if (!itemId) {
    console.log("Item Id attribute is missing or is Invalid");
    return null;
  }
  return DOMUtils.getElement<HTMLInputElement>(`li[data-item-id="${itemId}"] input[data-key="${itemId}"]`);
};

export const getCartItemId = (quantityContainer: HTMLDivElement): string | null => {
  const cartItem = quantityContainer.closest("li[data-item-id]") as HTMLLIElement | null;
  if (!cartItem) {
    console.log(`Element with selector 'li[data-item-id]' not found`);
    return null;
  }
  return cartItem.getAttribute("data-item-id");
};

export const renderUpdatedQuantity = (updatedQuantity: number, quantityInputField: HTMLInputElement) => {
  quantityInputField.value = updatedQuantity.toString();
};

export const limitQuantityToStock = (quantityContainer: HTMLDivElement, quantityInputField: HTMLInputElement) => {
  const increaseButton = quantityContainer.querySelector<HTMLButtonElement>("[data-increase-item-quantity]");
  const decreaseButton = quantityContainer.querySelector<HTMLButtonElement>("[data-decrease-item-quantity]");
  const itemStock = Number(quantityInputField?.max);
  const minQuantity = Number(quantityInputField?.min);
  const itemQuantity = Number(quantityInputField?.value);
  if (increaseButton) increaseButton.disabled = itemQuantity >= itemStock;
  if (decreaseButton) decreaseButton.disabled = itemQuantity <= minQuantity;
};

export const withProcessingState = (fn: (e: Event) => Promise<void>): ((e: Event) => Promise<void>) => {
  return async (e: Event): Promise<void> => {
    const targetElement = e.target as HTMLElement;
    if (!targetElement) return;
    enterProcessingState(targetElement);
    try {
      await fn(e);
    } catch (error) {
      console.log(error);
      showNotification("Failed to add product to cart. Please try again later..", false);
    } finally {
      exitProcessingState(targetElement);
    }
  };
};
