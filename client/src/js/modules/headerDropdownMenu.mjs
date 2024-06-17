const closeMenu = (menu) => menu.classList.remove("open");
const openMenu = (menu) => menu.classList.add("open");
const toggleClass = (element, className) => element.classList.toggle(className);

const headerDropdownMenuController = () => {
  const shopLink = document.querySelector("[data-shopLink]");
  const menu = document.querySelector(".header_dropDown_menu");
  shopLink.addEventListener("mouseenter", (e) => {
    openMenu(menu), toggleClass(shopLink, "open");
  });
  shopLink.addEventListener("mouseleave", (e) => {
    closeMenu(menu), toggleClass(shopLink, "open");
  });
  menu.addEventListener("mouseenter", (e) => {
    openMenu(menu), toggleClass(shopLink, "open");
  });
  menu.addEventListener("mouseleave", (e) => {
    closeMenu(menu), toggleClass(shopLink, "open");
  });
};

export default headerDropdownMenuController;
