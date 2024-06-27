//
import { test } from "./modal";
test()
let nav = 0; // Which month we are in.
let clicked = null; // Whichever day clicked
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events")) // If exists
  : []; // If not return an empty array.

const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const weekdays = [
  "Sunday", // 0
  "Monday", // 1
  "Tuesday", // 2
  "Wednesday", // 3
  "Thursday", // 4
  "Friday", // 5
  "Saturday", // 6
];

function openModal(date) {
  clicked = date; // Set which day the user clicked

  console.log(`start date: ${clicked}`);
  let s = calculatePredictions(date);
  console.log(s);
  const eventForDay = events.find((e) => e.date == clicked);

  if (eventForDay) {
    document.getElementById("eventText").innerHTML = eventForDay.title;
    deleteEventModal.style.display = "block";
  } else {
    newEventModal.style.display = "block";
  }
  backDrop.style.display = "block";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { timeZone: "UTC" });
}

// The months are number between 0 and 11 (January to December).

function load() {
  const dt = new Date();
  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  // The value of the 1st day of the month is 1, so when the value is equal to 0, it returns the last day of the previous month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Current month and the 1st day of that month
  const firstDayOfMonth = new Date(year, month, 1);
  //console.log(firstDayOfMonth);
  // English- US location ( en-us ). Options are for format.
  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  //console.log(dateString); // Saturday, 6/1/2024. We need the long format for weekday.
  // weekdays = Saturday, 6/1/2024, split at the comma and return the value at index 0, = 6
  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);
  //console.log(paddingDays);

  // Displaying Header Month 2024
  document.getElementById("monthDisplay").innerHTML = `
  ${dt.toLocaleDateString("en-us", { month: "long" })} ${year}`;

  calendar.innerHTML = ""; // Clear calendar

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");
    const dayString = `${month + 1}/${i - paddingDays}/${year}`;
    // const m = (dayString.split('/')[0])

    //  if (i === day) {
    //   daySquare.style.color = 'red'
    //   console.log(day)
    //   console.log(i)
    //  }

    if (i > paddingDays) {
      daySquare.innerHTML = `${i - paddingDays}`;
      const eventForDay = events.find((e) => e.date == dayString);

      if (i - paddingDays == day) {
        // current day display
        daySquare.classList.add("currentDay");
      }

      if (eventForDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }
      daySquare.addEventListener("click", () => openModal(dayString));
    } else {
      daySquare.classList.add("padding");
    }
    calendar.appendChild(daySquare);
  }
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove("error");
    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });
    localStorage.setItem("events", JSON.stringify(events));
    document.getElementById("startDate").innerHTML = `
    <li>Today is your first day</li>`;

    closeModal();
  } else {
    eventTitleInput.classList.add("error");
  }
  console.log(events);
}

function closeModal() {
  eventTitleInput.classList.remove("error");
  newEventModal.style.display = "none";
  deleteEventModal.style.display = "none";
  backDrop.style.display = "none";
  eventTitleInput.value = "";
  clicked = null;
  load();
}
function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  document.getElementById("startDate").innerHTML = "";
  closeModal();
}

// Back and next year Buttons
function initBtn() {
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;
    load();
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load();
  });
  document.getElementById("saveButton", () => {});
  document.getElementById("cancelButton").onclick = closeModal;
  document.getElementById("saveButton").onclick = saveEvent;
  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEvent);
  document.getElementById("closeButton").addEventListener("click", closeModal);
}
function calculatePredictions(startDate) {
  const cycleLength = 28; // Average cycle length in days (adjust as needed)
  const phases = ["Menstrual", "Follicular", "Ovulation", "Luteal"];
  const predictions = [];

  let currentDate = new Date(startDate);
  for (let i = 0; i < phases.length; i++) {
    const predictionDate = new Date(currentDate);
    predictionDate.setDate(predictionDate.getDate() + cycleLength);
    predictions.push({
      phase: phases[i],
      startDate: currentDate.toISOString().substr(0, 10),
      endDate: predictionDate.toISOString().substr(0, 10),
    });
    currentDate = new Date(predictionDate);
  }

  return predictions;
}
initBtn();
load();

// const url = "https://women-health-and-birth-control.p.rapidapi.com/health";
// const options = {
//   method: "GET",
//   headers: {
//     "x-rapidapi-key": '0284d7a3d8msh91349f8ed98628fp10b989jsn217fb3020db3',
//     "x-rapidapi-host": "women-health-and-birth-control.p.rapidapi.com",
//   },
// };

// async function testing() {
//   try {
//   const response = await fetch(url, options);
//   const result = await response.text();

//   console.log(result);
// } catch (error) {
//   //console.error(error);
// }
// }
// const initUrl =
//   "https://womens-health-menstrual-cycle-phase-predictions-insights.p.rapidapi.com/initialize"; // Hypothetical endpoint
// const initOptions = {
//   method: "GET",
//   headers: {
//     "x-rapidapi-key": "0284d7a3d8msh91349f8ed98628fp10b989jsn217fb3020db3",
//     "x-rapidapi-host":
//       "womens-health-menstrual-cycle-phase-predictions-insights.p.rapidapi.com",
//   },
// };

// async function fetchRequestId() {
//   try {
//     const initResponse = await fetch(initUrl, initOptions);
//     const initResult = await initResponse.json();
//     console.log(initResult); // Check the response structure
//     return initResult.request_id; // Adjust based on actual response structure
//   } catch (error) {
//     console.error("Error fetching request_id:", error);
//   }
// }

//fetchRequestId();
//testing()
// const url =
//   "https://womens-health-menstrual-cycle-phase-predictions-insights.p.rapidapi.com/process_cycle_data";
// const options = {
//   method: "POST",
//   headers: {
//     "x-rapidapi-key": "0284d7a3d8msh91349f8ed98628fp10b989jsn217fb3020db3",
//     "x-rapidapi-host":
//       "womens-health-menstrual-cycle-phase-predictions-insights.p.rapidapi.com",
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     current_date: formatDate(new Date()),
//     past_cycle_data: [
//       {
//         cycle_start_date: 7,
//         period_length: 0,
//       },
//     ],
//     max_cycle_predictions: 0,
//   }),
// };

// async function test() {
//   try {
//     const response = await fetch(url, options);
//     const result = await response.text();
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// }
// test()
