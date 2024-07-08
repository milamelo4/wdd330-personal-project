import { load } from "./calendar.js";
import { setLocalStorage, qs, getLocalStorage } from "./utils.mjs";
import { updateDateMessage, renderSymptoms } from "./symptomsDetails.mjs"

let clicked = null
const newEventModal = qs('#newEventModal')
const deleteEventModal = qs('#deleteEventModal')
const backDrop = qs('#modalBackDrop')
const dateMessage = qs("#dateMessage")

let events = getLocalStorage('events') || []

 export function openModal(date) {
  events = getLocalStorage("events") || []
  clicked = date// Set which day the user clicked
  // console.log(`start date: ${clicked}`)

  const eventForDay = events.find((e) => e.date == clicked)
    
   // setContent("#startDate", displayToCalendar(clicked));
   if (eventForDay) {
     qs('#eventText').innerHTML = eventForDay.title
     deleteEventModal.style.display = 'block'

   } else {
     newEventModal.style.display = 'block'
   }

   backDrop.style.display = 'block'
   qs('#menu-icon').style.display = 'none'
   
   renderSymptoms()
   updateDateMessage(clicked)
 }

export function saveEvent() {
  // let events = getLocalStorage("events") || [];
  const startPeriodInput = qs('#startPeriod')
  const endPeriodInput = qs('#endPeriod')
  let eventTitle = ''
  let eventType = ''

  if (startPeriodInput.checked) {
    eventTitle = 'Start period'
    eventType = 'start'
    setLocalStorage('startDate', clicked)

  } else if (endPeriodInput.checked) {
    eventTitle = 'End period'
    eventType = 'end'
    setLocalStorage('endDate', clicked)

  } else {
    const eventTitleInput = qs('#eventTitleInput')

    if (!eventTitleInput.value) {
      eventTitleInput.classList.add('error')
      console.log('Error: Event title is required.')
      return

    } else {
      eventTitle = eventTitleInput.value;
      eventType = 'custom'
      eventTitleInput.classList.remove('error')
    }
  }

  // Save symptoms to localStorage
  const selectedSymptoms = Array.from(
     document.querySelectorAll('input[name="symptom"]:checked')
  ).map((input) => input.value)

  events.push({
    date: clicked,
    title: eventTitle,
    type: eventType,
    symptoms: selectedSymptoms
  })

  setLocalStorage('events', events) // Save events to localStorage
  // console.log('Calling closeModal')
 
  displayMessage(eventTitle, clicked)
  // Reload the calendar to reflect the new event
  load()
  closeModal()
}


export function deleteEvent() {
  events = events.filter((e) => e.date !== clicked)
  setLocalStorage('events', events);
  // console.log("Event deleted:", clicked)
  clearMessage()
  closeModal();
  load()
  
}

function displayMessage(eventTitle, date) {
  const today = new Date();
  const clickedDate = new Date(date);

  if (clickedDate.toDateString() === today.toDateString()) {
    dateMessage.innerHTML = `Today is your first day of ${eventTitle}.`

  } else {
    const daysDifference = Math.floor(
      (today - clickedDate) / (1000 * 60 * 60 * 24)
    )
    dateMessage.innerHTML = `It's been ${daysDifference} days since your ${eventTitle}.`
  }

  setLocalStorage('lastMessage', { eventTitle, date })
}

export function loadMessage() {
  const lastMessage = getLocalStorage('lastMessage')
  if (lastMessage) {
    updateDateMessage(lastMessage.date)
  }
}

function clearMessage() {
  dateMessage.innerHTML = ''
  setLocalStorage('lastMessage', null)
}

export function closeModal() {
  const eventTitleInput = qs('#eventTitleInput')
  eventTitleInput.classList.remove('error')
  newEventModal.style.display = 'none'
  deleteEventModal.style.display = 'none'
  backDrop.style.display = 'none'
  eventTitleInput.value = ''
  clicked = null
  qs('#menu-icon').style.display = 'flex'
}



