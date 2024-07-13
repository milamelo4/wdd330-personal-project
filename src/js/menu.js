 import { qs } from "./utils.mjs";

 function toggleNav() {
  let menuIcon = qs('#menu-icon');
  let navContainer = qs('#nav-container');

  if (menuIcon && navContainer) {
    menuIcon.addEventListener('click', function () {
      navContainer.classList.toggle('open');
      menuIcon.classList.toggle('open');
    });
  } 
  else {
    console.warn('Menu icon or navigation container not found');
  }
}
toggleNav();
