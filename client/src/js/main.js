import headerDropdownMenuController_large from "./modules/HeaderDropdown/headerDropdownMenu.mjs";
import headerDropdownMenuController_Mobile from "./modules/HeaderDropdown/headerMobileDropdownMenu.mjs";
import "../styles/style.css";

const App = () => {
  headerDropdownMenuController_large();
  headerDropdownMenuController_Mobile();
};

document.addEventListener("DOMContentLoaded", App);
