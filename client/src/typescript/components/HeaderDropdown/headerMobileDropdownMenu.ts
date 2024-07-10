import DOMUtil from "../utils/domUtils";


// toggles the state of mobile submenu
const toggleMobileSubMenuState = (e:Event):void => {
  DOMUtil.toggleClass(e.target as HTMLElement, "open");
};

// toggles the state of the mobile dropdown menu between open and close
const toggleMobileMenuState = ():void => {
  const mobileMenuContainer: HTMLElement | null = document.querySelector("[data-mobileMenu]");
  DOMUtil.toggleClass(mobileMenuContainer, "open");
};

// toggle teh state of menu button between open and close.
const changeMenuButtonState = (menuButton:HTMLElement | null):void => {
  if (!menuButton) return;
  const menuButtonStates: HTMLElement[] = Array.from(menuButton?.children) as HTMLElement[];
  menuButtonStates.forEach((stateElement: HTMLElement ) => {
    DOMUtil.toggleClass(stateElement, "hidden");
  });
  DOMUtil.toggleAttributeBoolean(menuButton, "aria-expanded");
};

// opens and closes the mobile sub menu Shop
const toggleMobileShopSubMenu = (e:Event): void => {
  const shopSubMenuShopBtn: HTMLElement | null = document.querySelector(".mobile_menu_shop_Button");
  const mobileMenuButton: HTMLElement | null = e.target as HTMLElement;
  const isMenuExpanded = mobileMenuButton?.getAttribute("aria-expanded");
  if (isMenuExpanded === "true") {
    DOMUtil.addClass(shopSubMenuShopBtn, "open");
  } else {
    DOMUtil.removeClass(shopSubMenuShopBtn, "open");
  }
};

// opens and closes the mobile menu
const handleOpenMobileMenu = (e:Event):void => {
  changeMenuButtonState(e.target as HTMLElement);
  toggleMobileMenuState();
  toggleMobileShopSubMenu(e);
};

const headerDropdownMenuController_Mobile = (): void => {
  const headerMenuButton: HTMLElement | null = document.querySelector("[data-menuButton]");
  const mobilMenuButtons: NodeListOf<HTMLElement> = document.querySelectorAll("[data-mobileMenuBtn]") as NodeListOf<HTMLElement>;
  headerMenuButton?.addEventListener("click", handleOpenMobileMenu);
  mobilMenuButtons.forEach((button: HTMLElement) => button.addEventListener("click", toggleMobileSubMenuState));
};

export default headerDropdownMenuController_Mobile;
