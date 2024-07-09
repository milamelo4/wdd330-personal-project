import { load, initBtn } from "./calendar.js";

import { loadMessage } from "./modal.mjs";
import { toggleNav } from "./partials.js";

document.addEventListener("DOMContentLoaded", () => {
//   console.log("DOM fully loaded and parsed")

  initBtn()
  load()
  toggleNav()
  loadMessage()
 
})
