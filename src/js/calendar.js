import { openModal, saveEvent, deleteEvent, closeModal } from "./modal.mjs";
import { getLocalStorage, setLocalStorage, qs, setContent, getDateInfo, capitalize } from "./utils.mjs";

const weekdays = [
  'Sunday', // 0
  'Monday', // 1
  'Tuesday', // 2
  'Wednesday', // 3
  'Thursday', // 4
  'Friday', // 5
  'Saturday', // 6
]
let nav = 0
let events = getLocalStorage('events') || []

const calendar = qs('#calendar')

// Generates and displays the calendar for the current month (or a different month if nav buttons have been used)
export function load() {

  const dt = new Date() // Fri Jun 28 2024 14:42:56 GMT-0600 (Mountain Daylight Time)
  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav) // Adjust the month based on the navigation value
  }

  const { day, month, year, daysInMonth, firstDayOfMonth, dateString } = getDateInfo(dt)
  
  // Split where theres a comma and return index 0 
  
  setContent('#monthDisplay',`${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`)
  const paddingDays = weekdays.indexOf(dateString);
  displayCalendar(paddingDays, daysInMonth, day, month, year);
}

function welcomeMsg() {
  const userN = qs("#userName")
  let welcomeMsgDisplay = false
  if (welcomeMsgDisplay) return
  
  // welcome guest
  const nameValue = getLocalStorage('userName') || 'Guest'
  
  let charInx = 0
  const welcomeMessage = `Welcome ${capitalize(nameValue)}🤍`;

  function type() {
    
  if (charInx < welcomeMessage.length) {
    userN.textContent += welcomeMessage.charAt(charInx)
    charInx++;
    setTimeout(type, 200);
    
   } 
   else { welcomeMsgDisplay = true }// Don't display msg again
  }

  // call the function
  type()
  }
  
document.addEventListener("DOMContentLoaded", function () {
  welcomeMsg()
  
})


// Display Calendar
function displayCalendar(paddingDays, daysInMonth, currDay, currMonth, currYear) {
  calendar.innerHTML = "" // Clear calendar

  for (let i = 0; i < paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div')
    daySquare.classList.add('day')

    if (i >= paddingDays) {
      const dayOfMonth = i - paddingDays + 1
      daySquare.innerHTML = dayOfMonth

      const dayString = `${currMonth + 1}/${dayOfMonth}/${currYear}`
      const eventForDay = events.find((e) => e.date === dayString)

      // Highlight current day
      if (dayOfMonth === currDay && currMonth === new Date().getMonth()) {
        daySquare.classList.add('currentDay')
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div')
        eventDiv.classList.add('event');
        eventDiv.innerHTML = eventForDay.title
        daySquare.appendChild(eventDiv)
      }

      daySquare.onclick = () => openModal(dayString)
    } else {
      daySquare.classList.add('padding')
    }

    calendar.appendChild(daySquare)
  }
}

// Back and Next btn
export function initBtn() {
  qs('#nextButton').onclick = () => { nav++, load()}
  qs("#backButton").onclick = () => { nav--, load()}
  qs("#cancelButton").onclick = () => closeModal()
  qs("#saveButton").onclick = () => saveEvent()
  qs("#deleteButton").onclick = () => deleteEvent()
  qs("#closeButton").onclick = () => closeModal()
}




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
