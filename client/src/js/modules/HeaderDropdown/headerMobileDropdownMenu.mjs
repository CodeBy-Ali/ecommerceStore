import Util from "../utils/domUtils.mjs";





// toggles the state of mobile submenu
const toggleMobileSubMenuState = (e) => {
  Util.toggleClass(e.target, 'open');
  console.log(e.target)
}



// toggles the state of the mobile dropdown menu between open and close
const toggleMobileMenuState = () => {
  const mobileMenuContainer = document.querySelector('[data-mobileMenu]');
  Util.toggleClass(mobileMenuContainer, 'open');
}

// toggle teh state of menu button between open and close.
const changeMenuButtonState = (menuButton) => {
  const menuButtonStates = Array.from(menuButton.children);
  menuButtonStates.forEach(stateElement => {
    Util.toggleClass(stateElement,'hidden')
  });
  Util.toggleAttributeBoolean(menuButton, 'aria-expanded');
}

// 
const handleOpenMobileMenu = (e) => {
  changeMenuButtonState(e.target);
  toggleMobileMenuState();  
}


const headerDropdownMenuController_Mobile = () => {
  const headerMenuButton = document.querySelector('[data-menuButton]');
  const mobilMenuButtons = document.querySelectorAll('[data-mobileMenuBtn]');  
  headerMenuButton.addEventListener('click', handleOpenMobileMenu);
  mobilMenuButtons.forEach(button => button.addEventListener('click',toggleMobileSubMenuState));
}

export default headerDropdownMenuController_Mobile;