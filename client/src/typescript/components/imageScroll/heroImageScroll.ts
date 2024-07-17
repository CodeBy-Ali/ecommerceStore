// returns true of the given element is visible with in viewport else returns false
const isElementInView = (element:HTMLElement | null):boolean | void => {
  const windowHeight = window.innerHeight;
  const elementRect: DOMRect | undefined  = element?.getBoundingClientRect();
  if (elementRect) {
    return elementRect.top <= windowHeight && (elementRect.top + elementRect.height) > 0;
  }
  return false;
};

// translates the inner scroll in negative X direction about 1/5th of the document Scroll;
const moveInnerScroller = (innerScroller:HTMLElement | null): void => {
  if (!isElementInView(innerScroller)) return;
  const documentScrollTop: number = document.documentElement.scrollTop;
  if (innerScroller) {
    innerScroller.style.transform = `translateX(-${Math.floor(documentScrollTop / 5)}px)`;
  }
};

const heroImageScroll = ():void=> {
  const innerScroller: HTMLElement | null = document.querySelector("[data-imageInnerScroller]") as HTMLElement;
  document.addEventListener("scroll", ():void => moveInnerScroller(innerScroller));
};

export default heroImageScroll;
