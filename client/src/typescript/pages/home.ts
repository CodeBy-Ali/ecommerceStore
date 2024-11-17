import { handleAddToCart } from "../components/utils/cartUtils";
import DOMUtils from "../components/utils/domUtils";

// returns true of the given element is visible with in viewport else returns false
type View = "half" | "full" | "top";
const isElementInView = (element: HTMLElement, view: View): boolean | void => {
  const windowHeight = window.innerHeight;
  const elementRect: DOMRect | undefined = element.getBoundingClientRect();

  const elementTop =
    elementRect.top +
    (view == "full"
      ? elementRect.height
      : view === "half"
      ? elementRect.height / 2
      : 0);

  const elementBottom = elementRect.top + elementRect.height;

  return elementTop <= windowHeight && elementBottom > 0;
};

// translates the inner scroll in negative X direction about 1/5th of the document Scroll;
const moveInnerScroller = (innerScroller: HTMLElement): void => {
  if (!isElementInView(innerScroller, "top")) return;
  const documentScrollTop: number = document.documentElement.scrollTop;
  if (innerScroller) {
    innerScroller.style.transform = `translateX(-${Math.floor(
      documentScrollTop / 5
    )}px)`;
  }
};

function moveProductImage(...elements: HTMLElement[]) {
  elements.forEach((element) => {
    const isInView = isElementInView(element, "half");
    if (isInView) {
      element.style.transform = `translateX(0)`;
    } else {
      element.style.transform = `translateX(-7rem)`;
    }
  });
}

const initScrollAnimations = () => {
  const squalaneProductImage = DOMUtils.getElement<HTMLDivElement>(
    "[data-squalane-image-container]"
  );
  const innerScroller: HTMLElement | null = document.querySelector(
    "[data-imageInnerScroller]"
  ) as HTMLElement;

  const windowWidth = window.innerWidth;
  const laptopScreen = 1400;
  console.log(windowWidth);
  if (!squalaneProductImage || !innerScroller) return;

  document.addEventListener("scroll", () => {
    moveInnerScroller(innerScroller);
    if (windowWidth > laptopScreen) moveProductImage(squalaneProductImage);
  });
};

const initAddToCart = () => {
  const addToCartButtons = document.querySelectorAll<HTMLElement>(
    "[data-add-to-cart-btn]"
  );
  addToCartButtons?.forEach((button) =>
    button.addEventListener("click", handleAddToCart)
  );
};

const initHomePage = (): void => {
  initScrollAnimations();
  initAddToCart();
};

export default initHomePage;
