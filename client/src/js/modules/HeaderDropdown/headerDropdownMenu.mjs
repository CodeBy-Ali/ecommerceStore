import Util from "../utils/domUtils.mjs";
      

// hide the UnFocused Category Details Containers;
const hideAllSubMenus = () => {
  const submenusList = document.querySelectorAll(".submenu");
  submenusList.forEach((submenu) => Util.removeClass(submenu, "open"));
}

 // unHighlight the all unfocused category headings
const resetFocusOfSubMenuHeadings = () => {
  const subMenuHeadings = document.querySelectorAll(".subDropdown_item_category");
  subMenuHeadings.forEach((heading) => Util.removeClass(heading, "focused"));
}

// unHides the detail container of currently focused category.
const openSubmenu = (focusedCategory, submenusList) => {
  const focusedCategoryName = focusedCategory.getAttribute("data-categoryName");
  submenusList.forEach(menu => {
    if (menu.getAttribute("data-subMenuOf") === focusedCategoryName) {
      Util.addClass(menu, "open");
    }
  });
};

//  controls the submenu of the shop drop down;
const initializeSubDropDownController = () => {
  const submenusList = document.querySelectorAll(".submenu");
  const categoriesHeading = document.querySelectorAll(".subDropdown_item_category");
  categoriesHeading.forEach((category) =>
    category.addEventListener("mouseenter", (e) => {
      resetFocusOfSubMenuHeadings();
      // highlight the focused Category Heading.
      Util.addClass(category, "focused");
      hideAllSubMenus();
      openSubmenu(e.target, submenusList);
    })
  );
};


// displays the first submenu by highlighting the first categoryName and removing hidden class;
const showFirstSubmenu = () => {
  const subMenuHeading = document.querySelector('.subDropdown_category-container > ul li:first-child');
  const subMenuContainer = document.querySelector('.subDropdown_item_detail_container > div:first-child')
  Util.addClass(subMenuHeading, 'focused');
  Util.addClass(subMenuContainer, 'open');
}  


// toggles the menu between open and close
const toggleDropdownMenuState = (dropdownMenu,shopLink,openMenuButton) => {
  Util.toggleClass(dropdownMenu, "open");
  Util.toggleClass(shopLink, "open");
  Util.toggleAttributeBoolean(openMenuButton,"aria-expanded")
}


// controls the main shop dropdown menu in the header
const headerDropdownMenuController_large = () => {
  const shopLink = document.querySelector("[data-shopLink]");
  const dropDownContainer = document.querySelector(".dropDown_container");
  const dropDownMenu = document.querySelector("[data-dropDownMenu]");
  const openMenuButton = document.querySelector("[data-dropDownButton]")

  const toggleState = () => toggleDropdownMenuState(dropDownContainer, shopLink, openMenuButton)

  const toggleStateIfEnter = (e) => { console.log(e.key); if (e.key === "Enter" || e.keyCode === 13) { toggleState(); console.log(e.key) } };

  shopLink.addEventListener("mouseenter", (e) => {
    toggleState(),
    resetFocusOfSubMenuHeadings();
    hideAllSubMenus();
    showFirstSubmenu()
  });
  
  shopLink.addEventListener("mouseleave", toggleState);
  dropDownMenu.addEventListener("mouseenter",toggleState);
  dropDownMenu.addEventListener("mouseleave", toggleState);
  openMenuButton.addEventListener("keydown", toggleStateIfEnter)
  
  initializeSubDropDownController();
};

export default headerDropdownMenuController_large;
