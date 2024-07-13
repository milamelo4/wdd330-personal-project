import { load, initBtn } from "./calendar.js";

import { loadMessage } from "./modal.mjs";


document.addEventListener("DOMContentLoaded", () => {
// Initialize buttons
  initBtn();

  // Load calendar and events
  load();

  // Load initial msg and update
  loadMessage();
})
