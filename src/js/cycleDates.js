import { qs, getLocalStorage, formatDate } from "./utils.mjs"
// import { toggleNav } from "./menu.js";
// toggleNav()

export function displayCycleData() {
  const events = getLocalStorage("events") || [];
  const cycleDataContainer = qs("#cycle-data");

  const groupedByMonth = events.reduce((acc, event) => {
    const { date } = formatDate(event.date); // Use your formatDate function
    const monthYear = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!acc[monthYear]) {
      acc[monthYear] = []; // If there's no entry for this monthYear, create an array
    }
    //Checks if the month-year string is already a key in the accumulator object. If not, it initializes an empty array for that key.
    acc[monthYear].push(event); // Add the event to the array for this month-year
    return acc;
  }, {}); // Start with an empty object as the initial accumulator

  //Converts the grouped object into an array
  for (const [monthYear, events] of Object.entries(groupedByMonth)) {
    const monthSection = document.createElement("div");
    monthSection.classList.add("month-section");

    const monthHeader = document.createElement("h2");
    monthHeader.textContent = monthYear;
    monthSection.appendChild(monthHeader);

    events.forEach((event) => {
      const { formattedDate } = formatDate(event.date); // Use your formatDate function
      const eventDiv = document.createElement("div");
      eventDiv.classList.add("event-item");
      eventDiv.textContent = `${event.title}: ${formattedDate}`;
      monthSection.appendChild(eventDiv);
    });

    cycleDataContainer.appendChild(monthSection);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  displayCycleData();
})