
const removeClass = (element,className) => element.classList.remove(className);

const addClass = (element,className) => element.classList.add(className);

const toggleClass = (element, className) => element.classList.toggle(className);

// unHides the detail container of currently focused category.
const viewFocusCategoryDetail = (focusedCategory, categoryDetailsList) =>{
  const focusedCategoryName = focusedCategory.getAttribute('data-categoryName');
  categoryDetailsList.forEach(categoryDetail => {
    if (categoryDetail.getAttribute('data-detailOf') === focusedCategoryName) {
      addClass(categoryDetail, 'active');
    }
  })
}

// hides all the  details container of unfocused categories;
const hideUnFocusedCategoryDetails = (categoriesDetailContainers) => {
  categoriesDetailContainers.forEach(categoryDetail => removeClass(categoryDetail, 'active'));
}

//  controls the submenu of the shop drop down;
const initializeSubDropDownController = () => {
  const categoriesDetails = document.querySelectorAll('.detail');
  const categoriesHeading = document.querySelectorAll('.subDropdown_item_category')
  categoriesHeading.forEach(category => category.addEventListener('mouseenter', (e) => {
    hideUnFocusedCategoryDetails(categoriesDetails);
    viewFocusCategoryDetail(e.target,categoriesDetails);
  }))
}

// controls the main shop dropdown menu in the header
const headerDropdownMenuController = () => {
  const shopLink = document.querySelector("[data-shopLink]");
  const dropDownContainer = document.querySelector(".dropDown_container");
  const dropDownMenu = document.querySelector('[data-dropDownMenu]')
  shopLink.addEventListener("mouseenter", (e) => {
    addClass(dropDownContainer,"open"), toggleClass(shopLink, "open");
  });
  shopLink.addEventListener("mouseleave", (e) => {
    removeClass(dropDownContainer,'open'), toggleClass(shopLink, "open");
  });
  dropDownMenu.addEventListener("mouseenter", (e) => {
    addClass(dropDownContainer,'open'), toggleClass(shopLink, "open");
  });
  dropDownMenu.addEventListener("mouseleave", (e) => {
    removeClass(dropDownContainer,'open'), toggleClass(shopLink, "open");
  });

  initializeSubDropDownController();
};

export default headerDropdownMenuController;
