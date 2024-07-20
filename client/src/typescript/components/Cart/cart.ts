import DOMUtils from "../utils/domUtils";
import { displayResponseNotification } from "../utils/util";

interface IProduct {
  title: string;
  price: number;
  pubId: string;
  image: string;
}

interface ICartItem{
  product: IProduct,
  quantity: number,
}



const renderUpdatedCart = (cartItems: Array<ICartItem>) => {
  console.log(cartItems);
  const cartItemsContainer = document.querySelector("[data-cartItemsContainer]");
  if (cartItemsContainer) cartItemsContainer.innerHTML = "";
  
  const list = document.createElement('ul');
  const listItems = cartItems
    .map(({product,quantity}) => {
      return `
            <li class="cartItem">
              <div class="cartItem_image_container">
                <a href="/products/${product.title}">
                  <img src="${product.image}"  alt="">
                </a>
              </div>
              <div class="cartItem_details">
                
                <div class="cartItem_heading_container">
                  <a href="">${product.title}</a>
                  <p class="cartItem_price">${product.price}</p>
                </div>

                <div class="cartItem_quantity_container">
                  <div class="cartItem_quantity_wrapper">
                    <button class="decrease_cartQuantity_button" data-decreaseCartQuantityBtn>
                      <span class="visually-hidden">Decrease Quantity for The EveryThing Var</span>
                      <span>-</span>
                    </button>

                    <label class="visually-hidden" for="Quantity-The-EveryThing-Bar">
                      <span>Product The EveryThing Bar quantity</span>
                    </label>
                    <input class="cartItem_quantity_input" type="number" min="1" max="200" value="${quantity}" name="quantity" id="Quantity-The-EveryThing-Bar">

                    <button data-increaseCartQuantityBtn class="increase_cartQuantity_button">
                      <span class="visually-hidden">Increase Quantity for The EveryThing Bar</span>
                      <span>+</span>
                    </button>
                  </div>

                  <div>
                    <a href="" class="remove_cartItem">remove</a>
                  </div>
                </div>
              </div>
            </li>`;
    }).join("");

  list.innerHTML = listItems;
  cartItemsContainer?.appendChild(list);
};

const addProductToCart = async (e: Event) => {
  e.preventDefault();
  const targetButton = e.target as HTMLElement;
  if (!targetButton) return;
  const productId = targetButton.getAttribute("data-product-publicId");

  try {
    const response = await fetch("/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productPubId: productId }),
    });

    const responseBody = await response.json();
    if (!response.ok) {
      displayResponseNotification(responseBody?.message, false);
      return;
    }
    if (!responseBody.cartItems) throw new Error("Failed to get cartItems in response");
    renderUpdatedCart(responseBody?.cartItems);
    toggleCartDrawer();
  } catch (error) {
    console.log(error);
  }
  // const [productIdField] = cartForm.elements;
};

// closes and opens the cart menu
const toggleCartDrawer = (): void => {
  const cartDrawer = document.querySelector<HTMLElement>("[data-cartDrawer]");
  const body = document.querySelector<HTMLElement>("body");
  const overLay = document.querySelector<HTMLElement>("[data-overLay]");

  body && DOMUtils.toggleClass(body, "hideOverflow");
  cartDrawer && DOMUtils.toggleClass(cartDrawer, "open");
  overLay && DOMUtils.toggleClass(overLay, "active");
};

const Cart = (): void => {
  const cartButton = document.querySelector("[data-cartButton]");
  const closeCartButton = document.querySelector("[data-cartCloseButton]");
  const addToCartBtn = document.querySelector<HTMLElement>("[data-addToCartBtn]");

  cartButton?.addEventListener("click", toggleCartDrawer);
  closeCartButton?.addEventListener("click", toggleCartDrawer);
  addToCartBtn?.addEventListener("click", addProductToCart);
};

export default Cart;
