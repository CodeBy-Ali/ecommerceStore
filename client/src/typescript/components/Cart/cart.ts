import { renderCart } from "./modules/cartRender";
import {
  toggleCartDrawer,
  updateHeaderTotalCartItemsCount,
  getCartQuantityInputField,
  getCartItemId,
  limitQuantityToStock,
  updateItemQuantity,
  withProcessingState
} from "../utils/cartUtils";
import { handleApiResponse } from "../utils/pagesUtils";

interface IProduct {
  title: string;
  price: number;
  _id: string;
  images: Array<string>;
  stock: number;
  slug: string;
}

export interface IStoreSetting {
  freeShippingThreshold: number;
  currency: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICartData {
  cartItems: [ICartItem];
  storeSettings: IStoreSetting;
}
export interface IResponseBody {
  status: string;
  message?: string;
  data: ICartData;
}

const initCart = (): void => {
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
  ["click", "input"].forEach((event) => {
    itemQuantityContainers.forEach((itemContainer) => {
      itemContainer.addEventListener(event, handleAddToCartClick);
    });
  });
}

function handleAddToCartClick(e: Event): void {
  const quantityContainer = e.currentTarget as HTMLDivElement;
  const clickedElement = e.target as HTMLElement;
  if (e.type === "click" && clickedElement.tagName !== "BUTTON") return;
  const quantityInputField = getCartQuantityInputField(quantityContainer);
  if (!quantityInputField) return;

  const updatedQuantity = updateItemQuantity(quantityContainer, clickedElement, quantityInputField);
  if (!updatedQuantity) return console.log("Failed to update item quantity");

  const itemId = getCartItemId(quantityContainer);
  if (!itemId) return;
  storeUpdatedQuantityInDB(itemId, updatedQuantity);
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
    handleApiResponse<ICartData>(responseBody, updateCartState, ["cartItems", "storeSettings"]);
  } catch (error) {
    console.log(error);
  }
}

async function storeUpdatedQuantityInDB(itemId: string, quantity: number): Promise<void> {
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
    handleApiResponse<ICartData>(responseBody, updateCartState, ["cartItems", "storeSettings"]);
  } catch (error) {
    console.log(error);
  }
}


export const addProductToCart = withProcessingState(async (productId: string,quantity:number) => {
  const response = await fetch("/cart/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });
  const responseBody = await response.json();
  handleApiResponse<ICartData>(responseBody, updateCartState, ["cartItems", "storeSettings"]);
  toggleCartDrawer();
});


function updateCartState(data: ICartData) {
  const totalCartItems = data?.cartItems.reduce((total, { quantity }) => (total += quantity), 0);
  renderCart(data?.cartItems, totalCartItems, data?.storeSettings);
  updateHeaderTotalCartItemsCount(totalCartItems);
  initCart();
}
export default initCart;