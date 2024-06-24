// returns true of the given element is visible with in viewport else returns false
const isElementInView = (element) => {
  const windowHeight = window.innerHeight;
  const elementRect = element.getBoundingClientRect();
  return elementRect.top <= windowHeight && (elementRect.top + elementRect.height) > 0;
};

// translates the inner scroll in negative X direction about 1/5th of the document Scroll;
const moveInnerScroller = (innerScroller) => {
  if (!isElementInView(innerScroller)) return;
  const documentScrollTop = document.documentElement.scrollTop;
  innerScroller.style.transform = `translateX(-${Math.floor(documentScrollTop / 5)}px)`;
};

const createHeroImageScroll = () => {
  const innerScroller = document.querySelector("[data-imageInnerScroller]");
  document.addEventListener("scroll", () => moveInnerScroller(innerScroller));
};

export default createHeroImageScroll;
