import DOMUtils from "../../utils/domUtils";
import { ICartItem, IShippingConfig } from "../cart";
export const renderCart = (cartItems: Array<ICartItem>, totalItemsQuantity: number, shippingConfig: IShippingConfig): void => {
  const cartDrawer = document.querySelector("[data-cartDrawer]");
  const fragment = document.createDocumentFragment();
  const { freeShippingThreshold } = shippingConfig;
  if (!cartDrawer) return console.log("Failed to select cartDrawer section Element");
  cartDrawer.innerHTML = "";

  if (cartItems.length === 0) {
    const emptyCartWrapper = document.createElement("div");
    DOMUtils.addClass(emptyCartWrapper, "empty_cart_wrapper");
    fragment.appendChild(emptyCartWrapper);

    emptyCartWrapper.innerHTML = `
    <button class="cart_close_button" data-cartCloseButton>CLOSE</button>
      <div class="empty_cart_wrapper">
        <section class="empty_cart_header_section">
          <h2>Uh oh,looks like your  bag is empty!</h2>
          <p>Start philling your shopping bag now</p>
        </section>
        <section class="empty_cart_collectionList_section">
          <ul class="empty_cart_collectionList">
            <li class="">
              <a href="">
                <div class="empty_cart_collection_image_container">
                  <img src="/assets/Launch_TheEverythingBar_Ecomm_106.jpeg" alt="" width="130" height="86">
                </div>
                <div>
                  <h4>HAIR</h4>
                  <p>Shampoo & conditioner, Refill pods, etc</p>
                </div>
              </a>
            </li>
            <li>
              <a href="">
                <div class="empty_cart_collection_image_container">
                  <img src="/assets/dailyMoisturizer1.jpg" alt="" width="130" height="86">
                </div>
                <div>
                  <h4>FACE</h4>
                  <p>Razors,creams,oils</p>
                </div>
              </a>
            </li>
            <li>
              <a href="">
                <div class="empty_cart_collection_image_container">
                  <img src="/assets/handsoapformbottle.jpg" alt="" width="130" height="86">
                </div>
                <div>
                  <h4>BODY</h4>
                  <p>Lotions,hands soaps &amp; refills</p>
                </div>
              </a>
            </li>
          </ul>
        </section>
      </div>`;
  } else {
    const cartWrapper = document.createElement("div");
    DOMUtils.addClass(cartWrapper, "cart-wrapper");
    fragment.appendChild(cartWrapper);
    const subTotal = Number(
      cartItems
        .reduce((subtotal, { quantity, product }) => {
          return (subtotal += product.price * quantity);
        }, 0)
        .toFixed(2)
    );
    cartWrapper.innerHTML = `
         <section class="cart_header_section">
          <h2>Bag &lpar;<span class="cart_product_quantity" data-cartItemCount>${totalItemsQuantity}</span>&rpar;</h2>
          <p class="cart_header_message">${subTotal < freeShippingThreshold ? "Spend $" + (freeShippingThreshold - subTotal).toFixed(2) + " more  to get free shipping!" : "You've earned free shipping"}</p>
          <div class="cart_freeShipping_progressBar_wrapper">
            <span class="cart_freeShipping_progressBar" data-freeShippingProgressBar style="width: ${Math.floor((subTotal / freeShippingThreshold) * 100)}%;"></span>
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
                     <a href="/products/${product.slug}">
                       <img src="${product.images[0]}"  alt="">
                     </a>
                   </div>
                   <div class="cartItem_details">
                     
                     <div class="cartItem_heading_container">
                       <a href="/products/${product.slug}">${product.title}</a>
                       <p class="cartItem_price">Rs ${product.price}</p>
                     </div>
     
                     <div class="cartItem_quantity_container" >
                       <div class="cartItem_quantity_wrapper" data-cartItem-quantity-container>
                         <button class="decrease_Quantity_button"data-decrease-item-quantity data-counter-type="decrease">
                           <span class="visually-hidden">Decrease Quantity for The EveryThing Var</span>
                           <span>-</span>
                         </button>
     
                         <label class="visually-hidden" for="Quantity-The-EveryThing-Bar">
                           <span>Product The EveryThing Bar quantity</span>
                         </label>
                         <input class="item_quantity_input" type="number" min="1" max="${product.stock}" value="${quantity}" name="quantity" data-key="${product._id}" data-item-quantity-input id="Quantity-The-EveryThing-Bar">
     
                         <button data-increase-item-quantity class="increase_Quantity_button" data-counter-type="increase">
                           <span class="visually-hidden">Increase Quantity for The EveryThing Bar</span>
                           <span>+</span>
                         </button>
                       </div>
     
                       <div>
                         <button type="button" data-item-id="${product._id}"  aria-label="Remove ${product.title}" class="remove_cartItem" data-removeCartItemBtn>remove</button>
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
              Rs ${subTotal}
            </p>
          </div>
          <a href="/checkout" class="button--checkout">Checkout</a>
        </section>`;
  }
  cartDrawer.appendChild(fragment);
};
