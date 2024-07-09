import initCollectionsPage from "./pages/collections";
import initHomePage from "./pages/home";
import headerDropdownMenuController_large from "./components/HeaderDropdown/headerDropdownMenu";
import headerDropdownMenuController_Mobile from "./components/HeaderDropdown/headerMobileDropdownMenu";
import Accordion from "./components/accordion/accordion";

const App = (): void => {
  // global components for all pages
  headerDropdownMenuController_Mobile();
  headerDropdownMenuController_large();
  Accordion();

  
  const page: string | undefined = document.body.dataset.page;
  if (!page) throw new Error(`Failed to identify the current page.Correctly add the data-page="pageName" attribute in body tag of every page`);

  switch (page) {
    case 'home':
      initHomePage();
      break;
    case 'collections':
      initCollectionsPage();
      break;
  }
}

document.addEventListener('DOMContentLoaded', App);