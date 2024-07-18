import DOMUtils from "../utils/domUtils";













const addProductToCart = async (e: Event) => {
  e.preventDefault();
  const targetButton = e.target as HTMLElement;
  if (!targetButton) return;
  const productId = targetButton.getAttribute('data-product-id');
  
  try {
    const response = await fetch('/cart/add', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: productId }),
    })
    const productData = await response.json();
    console.log(productData)
  } catch (error) {
    console.log(error);    
  }
  // const [productIdField] = cartForm.elements;
}





// closes and opens the cart menu
const toggleCartDrawer = (e: Event): void => {
  const cartDrawer = document.querySelector<HTMLElement>('[data-cartDrawer]');
  const body = document.querySelector<HTMLElement>('body');
  const overLay = document.querySelector<HTMLElement>('[data-overLay]');
  
  body && DOMUtils.toggleClass(body,'hideOverflow')
  cartDrawer && DOMUtils.toggleClass(cartDrawer, 'open');
  overLay && DOMUtils.toggleClass(overLay, 'active');
}


const Cart = (): void => {
  const cartButton = document.querySelector('[data-cartButton]');
  const closeCartButton = document.querySelector('[data-cartCloseButton]')
  const addToCartBtn = document.querySelector<HTMLElement>('[data-addToCartBtn]')
  
  cartButton?.addEventListener('click',toggleCartDrawer)
  closeCartButton?.addEventListener('click',toggleCartDrawer)
  addToCartBtn?.addEventListener('click',addProductToCart)
}

export default Cart;