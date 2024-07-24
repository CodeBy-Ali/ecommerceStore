import DOMUtils from "../utils/domUtils";
import { displayResponseNotification } from "../utils/util";

interface IProduct {
  title: string;
  price: number;
  _id: string;
  image: string;
}

interface ICartItem {
  product: IProduct;
  quantity: number;
}


interface ICart{
  items: [ICartItem]
}

const Cart = (): void => {
  innitCartEventListeners();
};



function innitCartEventListeners(): void {
  const cartButton = document.querySelector("[data-cartButton]");
  const closeCartButton = document.querySelector("[data-cartCloseButton]");
  const addToCartBtn = document.querySelector<HTMLElement>("[data-addToCartBtn]");
  const removeCartItemBtn = document.querySelector<HTMLElement>('button[data-removeCartItemBtn]');
  const overLay = document.querySelector('[data-overlay]')

  cartButton?.addEventListener("click", toggleCartDrawer);
  closeCartButton?.addEventListener("click", toggleCartDrawer);
  addToCartBtn?.addEventListener("click", addProductToCart);
  removeCartItemBtn?.addEventListener('click',removeProductFromCart)
  overLay?.addEventListener('click', toggleCartDrawer);
}


// closes and opens the cart menu
function toggleCartDrawer(): void {
  const cartDrawer = document.querySelector<HTMLElement>("[data-cartDrawer]");
  const body = document.querySelector<HTMLElement>("body");
  const overLay = document.querySelector<HTMLElement>("[data-overLay]");

  body && DOMUtils.toggleClass(body, "hideOverflow");
  cartDrawer && DOMUtils.toggleClass(cartDrawer, "open");
  overLay && DOMUtils.toggleClass(overLay, "active");
};


async function addProductToCart (e: Event) {
  const targetButton = e.target as HTMLElement;
  if (!targetButton) return;
  const productId = targetButton.getAttribute("data-productId");
  
  try {
    if (!productId) throw new Error('Failed to get ProductId');

    const response = await fetch("/cart/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ productId: productId }),
    });

    const responseBody = await response.json();
    if (!response.ok) {
      displayResponseNotification(responseBody?.message, false);
      return;
    }
    const cart = responseBody as ICart;
    if (!cart) throw new Error("Failed to get cart in response");
    const totalCartItems = cart.items.reduce((total, { quantity }) => total += quantity, 0);
    renderUpdatedCart(cart.items,totalCartItems);
    updateHeaderCartQuantity(totalCartItems);
    toggleCartDrawer();
    innitCartEventListeners();
  } catch (error) {
    console.log(error);
  }
};


async function removeProductFromCart(e:Event){
  const removeButton = e.target as HTMLElement;
  const productId = removeButton.getAttribute('data-product-id');  
  
  try {
    if (!productId) throw new Error('Failed to get ProductId');
    const response = await fetch(`/cart/items/${productId}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
      },      
    })

    const responseBody = await response.json();
    if (!response.ok) {
      displayResponseNotification(responseBody?.message, false);
      return;
    }
    const cart = responseBody as ICart;
    if (!cart) throw new Error("Failed to get cart in response");
    const totalCartItems = cart.items.reduce((total, { quantity }) => total += quantity, 0);
    renderUpdatedCart(cart.items,totalCartItems);
    updateHeaderCartQuantity(totalCartItems);
    innitCartEventListeners();

  } catch (error) {
    console.log(error);
  }
}


function updateHeaderCartQuantity(totalCartItems: number): void{
  const cartQuantityContainer = document.querySelector<HTMLElement>('header span[data-headerCartQuantity]');
  DOMUtils.addTextContent(cartQuantityContainer,totalCartItems)
}


function renderUpdatedCart(cartItems: Array<ICartItem>,totalItemsQuantity:number)  {
  const cartDrawer = document.querySelector("[data-cartDrawer]");
  const fragment = document.createDocumentFragment();
  if (!cartDrawer) return console.log("Failed to select cartDrawer section Element");
  cartDrawer.innerHTML = "";

  if (cartItems.length === 0) {
    const emptyCartWrapper = document.createElement('div');
    DOMUtils.addClass(emptyCartWrapper, 'empty_cart_wrapper');
    fragment.appendChild(emptyCartWrapper);

    emptyCartWrapper.innerHTML = `
      <button class="cart_close_button" data-cartCloseButton>CLOSE</button>
        <section class="empty_cart_header_section">
          <h2>Uh oh,looks like your  bag is empty!</h2>
          <p>Start philling your shopping bag now</p>
        </section>
        <section class="empty_cart_collectionList_section">
          <ul class="empty_cart_collectionList">
            <li class="">
              <a href="">
                <div>
                  <img src="/assets/Launch_TheEverythingBar_Ecomm_106.jpeg" alt="">
                </div>
                <div>
                  <h4>HAIR</h4>
                  <p>Shampoo & conditioner, Refill pods, etc</p>
                </div>
              </a>
            </li>
            <li>
              <a href="">
                <div>
                  <img src="/assets/dailyMoisturizer.webp" alt="">
                </div>
                <div>
                  <h4>FACE</h4>
                  <p>Razors,creams,oils</p>
                </div>
              </a>
            </li>
            <li>
              <a href="">
                <div>
                  <img src="/assets/handsoapformbottle.webp" alt="">
                </div>
                <div>
                  <h4>BODY</h4>
                  <p>Lotions,hands soaps,refills</p>
                </div>
              </a>
            </li>
          </ul>
        </section>`;
  } else {
    const cartWrapper = document.createElement('div');
    DOMUtils.addClass(cartWrapper, 'cart-wrapper');
    fragment.appendChild(cartWrapper);

    cartWrapper.innerHTML = `
         <section class="cart_header_section">
           <h2>Bag &lpar;<span class="cart_product_quantity" data-cartItemCount>${totalItemsQuantity}</span>&rpar;</h2>
           <p class="cart_header_message">Spend $47.02 more or add a subscription to get free shipping!</p>
           <div class="cart_freeShipping_progressBar_wrapper">
             <span class="cart_freeShipping_progressBar" data-freeShippingProgressBar></span>
           </div>
           <button class="cart_close_button" data-cartCloseButton>CLOSE</button>
        </section>
        <section class="cartItems_container" data-cartItemsContainer>
          <ul>
           ${cartItems
        .map(({ product, quantity }) => {
          return `
                 <li class="cartItem" data-item-id="${product._id}">
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
                         <button type="button" data-product-id="${product._id}"  aria-label="Remove ${product.title}" class="remove_cartItem" data-removeCartItemBtn>remove</button>
                       </div>
                     </div>
                   </div>
                 </li>`;
        })
        .join("")}
          </ul>
        </section>

        <section class="cart_footer_section">
          <div class="cart_footer_totalPrize_container">
            <p>SUBTOTAl</p>
            <p>
              $${cartItems.reduce((subtotal, { quantity, product }) => {
                  return subtotal+=(product.price*quantity)
                }, 0)
              }
            </p>
          </div>
          <a href="" class="button--checkout">Checkout</a>
        </section>`;
  };
  cartDrawer.appendChild(fragment);
};





export default Cart;
