import initAccordion from "../accordion/accordion";
import DOMUtils from "../utils/domUtils";
import DOMUtil from "../utils/domUtils";

// hide the UnFocused Category Details Containers;
const hideAllSubMenus = ():void => {
  const submenusList: NodeListOf<HTMLElement> = document.querySelectorAll(".submenu");
  submenusList.forEach((submenu) => DOMUtil.removeClass(submenu, "open"));
};

// unHighlight the all unfocused category headings
const resetFocusOfSubMenuHeadings = ():void => {
  const subMenuHeadings: NodeListOf<HTMLElement> = document.querySelectorAll(".subDropdown_item_category");
  subMenuHeadings.forEach((heading) => DOMUtil.removeClass(heading, "focused"));
};

// unHides the detail container of currently focused category.
const openSubmenu = (focusedCategory: HTMLElement | null, submenusList: NodeListOf<HTMLElement>): void => {
  const focusedCategoryName = focusedCategory?.getAttribute("data-categoryName");
  submenusList.forEach((menu: HTMLElement) => {
    if (menu.getAttribute("data-subMenuOf") === focusedCategoryName) {
      DOMUtil.addClass(menu, "open");
    }
  });
};

//  controls the submenu of the shop drop down;
const initializeSubDropDownController = (): void => {
  const submenusList: NodeListOf<HTMLElement> = document.querySelectorAll(".submenu");
  const categoriesHeading: NodeListOf<HTMLElement> = document.querySelectorAll(".subDropdown_item_category");
  categoriesHeading.forEach((category: HTMLElement) =>
    category.addEventListener("mouseenter", (e: Event) => {
      resetFocusOfSubMenuHeadings();
      // highlight the focused Category Heading.
      DOMUtil.addClass(category, "focused");
      hideAllSubMenus();
      const focusedCategory: HTMLElement = e.target as HTMLElement;
      openSubmenu(focusedCategory, submenusList);
    })
  );
};

// displays the first submenu by highlighting the first categoryName and removing hidden class;
const showFirstSubmenu = (): void => {
  const subMenuHeading: HTMLElement | null = document.querySelector(".subDropdown_category-container > ul li:first-child");
  const subMenuContainer: HTMLElement | null = document.querySelector(".subDropdown_item_detail_container > div:first-child");
  subMenuHeading && DOMUtil.addClass(subMenuHeading, "focused");
  subMenuContainer && DOMUtil.addClass(subMenuContainer, "open");
};

// toggles the menu between open and close
const toggleDropdownMenuState = (dropdownMenu: HTMLElement | null, shopLink: HTMLElement | null, openMenuButton: HTMLElement | null): void => {
  dropdownMenu && DOMUtil.toggleClass(dropdownMenu, "open");
  shopLink && DOMUtil.toggleClass(shopLink, "open");
  openMenuButton && DOMUtil.toggleAttributeBoolean(openMenuButton, "aria-expanded");
};

// controls the main shop dropdown menu in the header
const headerDropdownMenuController_large = (): void => {
  const shopLink: HTMLElement | null = document.querySelector("[data-shopLink]");
  const dropDownContainer: HTMLElement | null = document.querySelector(".dropDown_container");
  const dropDownMenu: HTMLElement | null = document.querySelector("[data-dropDownMenu]");
  const openMenuButton: HTMLElement | null = document.querySelector("[data-dropDownButton]");

  const toggleState = (): void => toggleDropdownMenuState(dropDownContainer, shopLink, openMenuButton);

  const toggleStateIfEnter = (e: KeyboardEvent): void => {
    if (e.key === "Enter" || e.keyCode === 13) {
      toggleState();
      console.log(e.key);
    }
  };

  shopLink?.addEventListener("mouseenter", (e: Event): void => {
    toggleState(), resetFocusOfSubMenuHeadings();
    hideAllSubMenus();
    showFirstSubmenu();
  });

  shopLink?.addEventListener("mouseleave", toggleState);
  dropDownMenu?.addEventListener("mouseenter", toggleState);
  dropDownMenu?.addEventListener("mouseleave", toggleState);
  openMenuButton?.addEventListener("keydown", toggleStateIfEnter);

  initializeSubDropDownController();
};



 
// ------------------------------ Drop-Down-Mobile ------------------------------//






// toggles the state of the mobile dropdown menu between open and close
const toggleMobileMenuState = ():void => {
  const mobileMenuContainer: HTMLElement | null = document.querySelector("[data-mobileMenu]");
  DOMUtil.toggleClass(mobileMenuContainer, "open");
};


// toggle teh state of menu button between open and close.
const toggleMenuButtonText = (menuButton:HTMLElement | null):void => {
  if (!menuButton) return;
  const menuButtonStates: HTMLElement[] = Array.from(menuButton?.children) as HTMLElement[];
  menuButtonStates.forEach((stateElement: HTMLElement ) => {
    DOMUtil.toggleClass(stateElement, "hidden");
  });
  DOMUtil.toggleAttributeBoolean(menuButton, "aria-expanded");
};


// opens and closes the mobile sub menu Shop
const toggleMobileShopSubMenu = (e:Event): void => {
  const subMenuShopBtn: HTMLElement | null = document.querySelector(".mobile_menu_shop_Button");
  const mobileMenuButton: HTMLElement | null = e.target as HTMLElement;
  const subMenuShopBody = DOMUtils.getElement<HTMLElement>('[data-mobile-shop-submenu-body]');
  
  if (!subMenuShopBody) return;

  const isMenuExpanded = mobileMenuButton?.getAttribute("aria-expanded");
  if (isMenuExpanded === "true") {
    DOMUtils.addClass(subMenuShopBtn, "open");
    DOMUtils.addClass(subMenuShopBody, "open");
    subMenuShopBody.style.maxHeight = subMenuShopBody.scrollHeight + "px";
  } else {
    DOMUtils.removeClass(subMenuShopBtn, "open");
    DOMUtils.removeClass(subMenuShopBody, "open");
    subMenuShopBody.style.maxHeight = "0px"; 
  }
};



const handleMenuButtonClick = (e: Event) =>{
  toggleMenuButtonText(e.target as HTMLElement);
  toggleMobileMenuState();
  toggleMobileShopSubMenu(e);
}

const initMobileHeaderDropDownAccordion = () => {
  const mobileDropDownAccordion = DOMUtils.getElement<HTMLElement>('[data-drop-down-accordion-mobile]');
  const headerMenuButton = DOMUtil.getElement<HTMLElement>("[data-mobile-header-menu-button]");

  if (!mobileDropDownAccordion || !headerMenuButton) return;

  headerMenuButton.addEventListener('click', handleMenuButtonClick);
  initAccordion(mobileDropDownAccordion);
}


const Header = () => {
  headerDropdownMenuController_large();
  initMobileHeaderDropDownAccordion();
}

export default Header;
