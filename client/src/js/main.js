import headerDropdownMenuController_large from "./modules/HeaderDropdown/headerDropdownMenu.mjs";
import headerDropdownMenuController_Mobile from "./modules/HeaderDropdown/headerMobileDropdownMenu.mjs";
import createHeroImageScroll from "./modules/imageScroll/heroImageScroll.mjs";


const App = () => {
  headerDropdownMenuController_large();
  headerDropdownMenuController_Mobile();
  createHeroImageScroll();
};

document.addEventListener("DOMContentLoaded", App);
