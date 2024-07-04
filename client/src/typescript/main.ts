import headerDropdownMenuController_Mobile from "./components/HeaderDropdown/headerMobileDropdownMenu";
import headerDropdownMenuController_large from "./components/HeaderDropdown/headerDropdownMenu";
import createHeroImageScroll from "./components/imageScroll/heroImageScroll";

const App = (): void => {
  headerDropdownMenuController_large();
  headerDropdownMenuController_Mobile();
  createHeroImageScroll();
};

document.addEventListener("DOMContentLoaded", App);
