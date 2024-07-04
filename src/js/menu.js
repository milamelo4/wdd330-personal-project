import { qs } from "./utils.mjs";

export function toggleNav() {
  let menuIcon = qs("#menu-icon");
  let navContainer = qs("#nav-container");

  menuIcon.addEventListener("click", function () {
    navContainer.classList.toggle("open");
    menuIcon.classList.toggle("open");
  });
}
