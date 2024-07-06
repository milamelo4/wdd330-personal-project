import { load, initBtn } from "./calendar.js";
import { toggleNav } from "./menu.js";
import { loadMessage } from "./modal.mjs";

document.addEventListener("DOMContentLoaded", () => {
//   console.log("DOM fully loaded and parsed")
  initBtn()
  load()
  toggleNav()
  loadMessage()
})
