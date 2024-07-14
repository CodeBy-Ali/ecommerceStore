import DOMUtils from "../utils/domUtils";
















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

  cartButton?.addEventListener('click',toggleCartDrawer)
  closeCartButton?.addEventListener('click',toggleCartDrawer)
}

export default Cart;