import DOMUtils from "../utils/domUtils";

interface HtmlSwiperElement extends Element {
  initialize: Function;
}

export const productImageSlider = () => {
  const swiper = document.querySelector<HtmlSwiperElement>("swiper-container[data-swiper-container-product-images]");

  if (!swiper) return;
  const swiperParams = {
    slidesPerView: "auto",
    speed: "700",
    spaceBetween: "5",
    breakpoints: {
      767: {
        direction: "vertical",
        spaceBetween: "0",
      },
    },
    on: {
      init() {
        // ...
      },
    },
  };
  Object.assign(swiper, swiperParams);
  swiper.initialize();
};

export const additionalProductSlider = () => {
  const swiper = document.querySelector<HtmlSwiperElement>('[data-swiper-container-additional-products]');
  if (!swiper) return;

  const swiperParams = {
    slidesPerView: "auto",
    speed: "700",
    spaceBetween: "0",
    centeredSlides: false,
    on: {
      init() {
        // ...
      },
    },
  }

  Object.assign(swiper, swiperParams);
  swiper.initialize();
}