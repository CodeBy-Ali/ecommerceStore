// pages
import initCollectionPage from "./pages/collections";
import initHomePage from "./pages/home";
import initRegisterPage from "./pages/register";
import initLoginPage from "./pages/login";
import initCheckoutPage from "./pages/checkout";
// components
// import headerDropdownMenuController_large from "./components/HeaderDropdown/headerDropdownMenu";
import Header from "./components/Header/header";
import Cart from "./components/Cart/cart";
import initProductPage from "./pages/product";
import DOMUtils from "./components/utils/domUtils";
import initAccordion from "./components/accordion/accordion";

const App = (): void => {

  const page: string | undefined = document.body.dataset.page;
  if (!page) throw new Error(`Failed to identify the current page.Correctly add the data-page="pageName" attribute in body tag of every page`);
  switch (page) {
    case "home":
      initHomePage();
      break;
    case "collection":
      initCollectionPage();
      break;
    case "register":
      initRegisterPage();
      break;
    case "login":
      initLoginPage();
      break;
    case "product":
      initProductPage();
      break; 
    case "checkout":
      initCheckoutPage();
  }
  // initialize global components for every page except checkout 
  if (page !== "checkout") { 
    initGlobalComponents();
  } 
};


function initGlobalComponents():void {
  // headerDropdownMenuController_Mobile();
  // headerDropdownMenuController_large();
  Header();
  Cart();
  const footerAccordion = DOMUtils.getElement<HTMLElement>('[data-footer-accordion]');
  if(footerAccordion) initAccordion(footerAccordion);
  
}

document.addEventListener("DOMContentLoaded", App);
