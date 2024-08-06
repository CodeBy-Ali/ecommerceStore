import DOMUtils from "../utils/domUtils";
import { showNotification } from "../utils/util";
import { renderCart } from "./modules/cartRender";
import {
  toggleCartDrawer,
  updateHeaderTotalCartItemsCount,
  getCartQuantityInputField,
  renderUpdatedQuantity,
  getUpdatedQuantity,
  getCartItemId,
  limitQuantityToStock,
  withProcessingState
} from "../utils/cartUtils";


interface IProduct {
  title: string;
  price: number;
  _id: string;
  image: string;
  stock: number;
}

export interface IStoreSetting {
  freeShippingThreshold: number;
  currency: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface IResponseBody {
  status: string,
  message?: string,
  data: {
    cartItems: [ICartItem];
    storeSettings: IStoreSetting;
  }
}

const Cart = (): void => {
  const itemQuantityContainers = document.querySelectorAll<HTMLDivElement>("div[data-cartItem-quantity-container]");

  itemQuantityContainers.forEach((quantityContainer) => {
    const quantityInputField = getCartQuantityInputField(quantityContainer);
    if (quantityInputField) limitQuantityToStock(quantityContainer, quantityInputField);
  });

  innitCartEventListeners();
};

function innitCartEventListeners(): void {
  const cartButton = document.querySelector("[data-cartButton]");
  const closeCartButton = document.querySelector("[data-cartCloseButton]");
  const removeCartItemBtn = document.querySelector<HTMLElement>("button[data-removeCartItemBtn]");
  const overLay = document.querySelector("[data-overlay]");
  const itemQuantityContainers = document.querySelectorAll("div[data-cartItem-quantity-container]");

  cartButton?.addEventListener("click", toggleCartDrawer);
  closeCartButton?.addEventListener("click", toggleCartDrawer);
  removeCartItemBtn?.addEventListener("click", removeProductFromCart);
  overLay?.addEventListener("click", toggleCartDrawer);
  ["click", "input"].forEach((event) => itemQuantityContainers.forEach((itemContainer) => itemContainer.addEventListener(event, updateItemQuantity)));
}

function updateItemQuantity(e: Event): void {
  const quantityContainer = e.currentTarget as HTMLDivElement;
  const clickedElement = e.target as HTMLElement;
  if (e.type === "click" && clickedElement.tagName === "INPUT") return;

  const quantityInputField = getCartQuantityInputField(quantityContainer);
  if (!quantityInputField) return;

  const updatedQuantity = getUpdatedQuantity(clickedElement, quantityInputField);
  if (!updatedQuantity) return;

  const itemId = getCartItemId(quantityContainer);
  if (!itemId) return;
  renderUpdatedQuantity(updatedQuantity, quantityInputField);
  limitQuantityToStock(quantityContainer, quantityInputField);
  updateItemQuantityInDB(itemId, updatedQuantity);
}


async function removeProductFromCart(e: Event): Promise<void> {
  const removeButton = e.target as HTMLElement;
  const itemId = removeButton.getAttribute("data-item-id");

  try {
    if (!itemId) throw new Error("Failed to get item ID");
    const response = await fetch(`/cart/items/${itemId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    const responseBody = await response.json();
    const { data ,status} = responseBody as IResponseBody;
    if (!response.ok || status !== 'success') {
      showNotification(responseBody?.message, false);
      return;
    }
    const totalCartItems = data?.cartItems.reduce((total, { quantity }) => (total += quantity), 0);
    renderCart(data?.cartItems, totalCartItems, data?.storeSettings);
    updateHeaderTotalCartItemsCount(totalCartItems);
    Cart();
  } catch (error) {
    console.log(error);
  }
}

async function updateItemQuantityInDB(itemId: string, quantity: number): Promise<void> {
  try {
    const response = await fetch(`/cart/items/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        itemId: itemId,
        quantity: quantity,
      }),
    });

    const responseBody = await response.json();
    const { data, status } = responseBody as IResponseBody;
    if (!response.ok || status !== 'success') {
      showNotification(responseBody?.message, false);
      return;
    }
    const totalCartItems = data.cartItems.reduce((total, { quantity }) => (total += quantity), 0);
    renderCart(data.cartItems, totalCartItems, data.storeSettings);
    updateHeaderTotalCartItemsCount(totalCartItems);
    Cart();
  } catch (error) {
    console.log(error);
  }
}

export default Cart;
