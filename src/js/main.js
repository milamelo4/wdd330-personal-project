import { load, initBtn } from "./calendar.mjs";
import { loadMessage } from "./modal.mjs";

document.addEventListener("DOMContentLoaded", () => {
// Initialize buttons
  initBtn();
  // Load calendar and events
  load();
  // Load initial msg and update
  loadMessage();
});
