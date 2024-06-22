import Util from "../utils/domUtils.mjs";

// toggles the state of mobile submenu
const toggleMobileSubMenuState = (e) => {
  Util.toggleClass(e.target, "open");
};

// toggles the state of the mobile dropdown menu between open and close
const toggleMobileMenuState = () => {
  const mobileMenuContainer = document.querySelector("[data-mobileMenu]");
  Util.toggleClass(mobileMenuContainer, "open");
};

// toggle teh state of menu button between open and close.
const changeMenuButtonState = (menuButton) => {
  const menuButtonStates = Array.from(menuButton.children);
  menuButtonStates.forEach((stateElement) => {
    Util.toggleClass(stateElement, "hidden");
  });
  Util.toggleAttributeBoolean(menuButton, "aria-expanded");
};

// opens and closes the mobile sub menu Shop
const toggleMobileShopSubMenu = (e) => {
  const shopSubMenuShopBtn = document.querySelector(".mobile_menu_shop_Button");
  const mobileMenuButton = e.target;
  const isMenuExpanded = mobileMenuButton.getAttribute("aria-expanded");
  if (isMenuExpanded === 'true') {
    Util.addClass(shopSubMenuShopBtn, "open");
  } else {
    Util.removeClass(shopSubMenuShopBtn, "open");
  }
};

// opens and closes the mobile menu
const handleOpenMobileMenu = (e) => {
  changeMenuButtonState(e.target);
  toggleMobileMenuState();
  toggleMobileShopSubMenu(e);
};

const headerDropdownMenuController_Mobile = () => {
  const headerMenuButton = document.querySelector("[data-menuButton]");
  const mobilMenuButtons = document.querySelectorAll("[data-mobileMenuBtn]");
  headerMenuButton.addEventListener("click", handleOpenMobileMenu);
  mobilMenuButtons.forEach((button) => button.addEventListener("click", toggleMobileSubMenuState));
};

export default headerDropdownMenuController_Mobile;
