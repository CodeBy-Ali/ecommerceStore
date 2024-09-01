// pages
import initCollectionPage from "./pages/collections";
import initHomePage from "./pages/home";
import initRegisterPage from "./pages/register";
import initLoginPage from "./pages/login";
import initCheckoutPage from "./pages/checkout";
// components
import headerDropdownMenuController_large from "./components/HeaderDropdown/headerDropdownMenu";
import headerDropdownMenuController_Mobile from "./components/HeaderDropdown/headerMobileDropdownMenu";
import initAccordion from "./components/accordion/accordion";
import initCart from "./components/Cart/cart";
import initProductPage from "./pages/product";

const App = (): void => {
  // global components for all pages
  headerDropdownMenuController_Mobile();
  headerDropdownMenuController_large();
  initAccordion();
  initCart();

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
    case "checkout":
      initCheckoutPage();
  }
};

document.addEventListener("DOMContentLoaded", App);
