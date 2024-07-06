import { openModal, saveEvent, deleteEvent, closeModal } from "./modal.mjs";
import { getLocalStorage, qs, setContent, getDateInfo, capitalize } from "./utils.mjs";

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
let events = getLocalStorage("events") || []
const calendar = qs("#calendar")
 let nav = 0;

function addEventClassToRange(startDate, endDate) {
 const currentDate = new Date(startDate);
 currentDate.setDate(currentDate.getDate() + 1) // Move to the day after the start date
//  console.log(`Adding event-range class from ${startDate} to ${endDate}`)
 while (currentDate < endDate) {
   // Skip the end date
   const dayString = `${
     currentDate.getMonth() + 1
   }/${currentDate.getDate()}/${currentDate.getFullYear()}`
   const daySquare = qs(`[data-date='${dayString}']`)

   if (daySquare) {
    //  console.log(`Adding event-range class to ${dayString}`)
     daySquare.classList.add('event-range')

   } else {
    //  console.log(`No daySquare found for ${dayString}`)
   }
   currentDate.setDate(currentDate.getDate() + 1)
 }
}

export function load() { 
  let events = getLocalStorage("events") || []
  
  
  const dt = new Date();
  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav)
  }

  const { day, month, year, daysInMonth, firstDayOfMonth, dateString } = getDateInfo(dt)

  setContent('#monthDisplay', `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`)
  const paddingDays = weekdays.indexOf(dateString)

  calendar.innerHTML = ""
  
  for (let i = 0; i < paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div')
    daySquare.classList.add('day')

    if (i >= paddingDays) {
      const dayOfMonth = i - paddingDays + 1
      const dayString = `${month + 1}/${dayOfMonth}/${year}`
      daySquare.setAttribute('data-date', dayString)
      daySquare.innerHTML = dayOfMonth
      //  console.log(`Setting data-date: ${dayString}`)
      
      const eventForDay = events.find((e) => e.date === dayString)
        // console.log(`Checking events for: ${dayString}`, eventForDay)

      if (dayOfMonth === day && month === new Date().getMonth()) {
        daySquare.classList.add('currentDay')
      }

      if (eventForDay) {
       
        // console.log('Event found for day:', dayString, eventForDay);
        const eventDiv = document.createElement('div')
        eventDiv.classList.add('event')
        
        eventDiv.innerHTML = eventForDay.title
        daySquare.appendChild(eventDiv)

       if (eventForDay.type === 'start') {
         const endEvent = events.find((e) => e.type === 'end')
         if (endEvent) {
           addEventClassToRange(
             new Date(eventForDay.date),
             new Date(endEvent.date)
           )
         }
       } 
    }
    daySquare.onclick = () => {
      openModal(dayString);
    }
    // console.log(`Date clicked: ${dayString}`);
     
    } else {
      daySquare.classList.add('padding')
    }

    calendar.appendChild(daySquare)
  }

  // check each event call range function
   events.forEach((event) => {
     if (event.type === 'start') {
       const endEvent = events.find(
         (e) => e.type === 'end' && new Date(e.date) >= new Date(event.date)
       )
       if (endEvent) {
         addEventClassToRange(new Date(event.date), new Date(endEvent.date))
       }
     }
   })
  
}

function welcomeMsg() {
  const userN = qs("#userName")
  let welcomeMsgDisplay = false
  if (welcomeMsgDisplay) return

  // welcome guest
  const nameValue = getLocalStorage("userName") || "Guest"

  let charInx = 0;
  const welcomeMessage = `Welcome ${capitalize(nameValue)}🤍`

  function type() {
    if (charInx < welcomeMessage.length) {
      userN.textContent += welcomeMessage.charAt(charInx)
      charInx++
      setTimeout(type, 200)
    } else {
      welcomeMsgDisplay = true
    } // Don't display msg again
  }

  // call the function
  type()
}
welcomeMsg()
export function initBtn() {
  qs('#nextButton').onclick = () => {nav++; load()}
  qs('#backButton').onclick = () => {nav--; load()}
  qs('#cancelButton').onclick = () => closeModal()
  qs('#saveButton').onclick = () =>  {saveEvent(); load()}
  qs('#deleteButton').onclick = () => deleteEvent()
  qs('#closeButton').onclick = () => closeModal()
}

document.addEventListener('DOMContentLoaded', function () {
  load()
})
