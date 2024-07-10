import { load, initBtn } from "./calendar.js";

import { loadMessage } from "./modal.mjs";


document.addEventListener("DOMContentLoaded", () => {
//   console.log("DOM fully loaded and parsed")

  initBtn()
  load()
  
  loadMessage()
 
})
