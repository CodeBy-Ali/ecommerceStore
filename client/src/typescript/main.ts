// pages
import initCollectionsPage from "./pages/collections";
import initHomePage from "./pages/home";
import initRegisterPage from "./pages/register";
import initLoginPage from "./pages/login";

// components
import headerDropdownMenuController_large from "./components/HeaderDropdown/headerDropdownMenu";
import headerDropdownMenuController_Mobile from "./components/HeaderDropdown/headerMobileDropdownMenu";
import Accordion from "./components/accordion/accordion";
import Cart from "./components/Cart/cart";

const App = (): void => {
  // global components for all pages
  headerDropdownMenuController_Mobile();
  headerDropdownMenuController_large();
  Accordion();
  Cart();
  
  const page: string | undefined = document.body.dataset.page;
  if (!page) throw new Error(`Failed to identify the current page.Correctly add the data-page="pageName" attribute in body tag of every page`);
  switch (page) {
    case 'home':
      initHomePage();
      break;
    case 'collections':
      initCollectionsPage();
      break;
    case 'register':
      initRegisterPage();
      break;
    case 'login':
      initLoginPage();
  }
}

document.addEventListener('DOMContentLoaded', App);