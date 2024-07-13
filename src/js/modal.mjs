import { load } from "./calendar.js";
import {
  setLocalStorage,
  qs,
  getLocalStorage, alertMessage,
} from "./utils.mjs";
import {
  updateDateMessage,
  renderSymptoms,
  getMenstrualPhaseMessage,
} from "./symptomsDetails.mjs";

let clicked = null;
const newEventModal = qs('#newEventModal');
const deleteEventModal = qs('#deleteEventModal');
const backDrop = qs('#modalBackDrop');
const dateMessage = qs("#dateMessage");

let events = getLocalStorage('events') || [];

 export function openModal(date) {
  events = getLocalStorage('events') || [];
  clicked = date;// Set which day the user clicked
  // console.log(`start date: ${clicked}`)

  const eventForDay = events.find((e) => e.date == clicked);
    
   // setContent('#startDate', displayToCalendar(clicked));
   if (eventForDay) {
     qs('#eventText').innerHTML = eventForDay.title;
     deleteEventModal.style.display = 'block';
     

   } else {
     newEventModal.style.display = 'block';
   }

   backDrop.style.display = 'block';
   qs('#menu-icon').style.display = 'none';
   
   renderSymptoms();
  //  updateDateMessage(clicked);
 }

export function saveEvent() {
  let events = getLocalStorage('events') || [];
  const startPeriodInput = qs('#startPeriod');
  const endPeriodInput = qs('#endPeriod');
  let eventTitle = '';
  let eventType = '';
  const eventTitleInput = qs('#eventTitleInput');
 

  const selectedFlow = qs('input[name="flow"]:checked');
  const flowIntensity = selectedFlow ? selectedFlow.value : null;

  if (startPeriodInput.checked) {
    eventTitle = 'Start period';
    eventType = 'start';
    setLocalStorage('startDate', clicked);
    alertMessage(eventTitle)

  } 
  else if (endPeriodInput.checked) {
    eventTitle = 'End period';
    eventType = 'end';
    setLocalStorage('endDate', clicked);
    alertMessage(eventTitle)
  } 

  else if (eventTitleInput.value.trim() === '') {
    eventTitleInput.classList.add('error');
    console.log('Error: Event title is required.');
    return;
  }

  // Save symptoms to localStorage
  const selectedSymptoms = Array.from(
     document.querySelectorAll('input[name="symptom"]:checked')
  ).map((input) => input.value)

  events.push({
    date: clicked,
    title: eventTitle,
    type: eventType,
    symptoms: selectedSymptoms,
    flow: flowIntensity,
    notes: eventTitleInput.value.trim()
  })
  
  setLocalStorage('events', events) // Save events to localStorage
  // console.log('Calling closeModal')
  
 if (eventTitle === 'Start period' || eventTitle === 'End period') {
   displayMessage(eventTitle, clicked); // Display the message
    }
  // Reload the calendar to reflect the new event
  
  closeModal()
  load()
}


export function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  setLocalStorage('events', events);
  alertMessage('Event deleted')
  // console.log("Event deleted:", clicked)
  clearMessage();
  closeModal();
  load();
  
}

export function cancelEvent() {
  clicked = null;
  closeModal();
  load();
 
}

function displayMessage(eventTitle, date) {
  const today = new Date();
  const clickedDate = new Date(date);
  //console.log(clickedDate);
  if (clickedDate.toDateString() === today.toDateString()) {
    dateMessage.innerHTML = `Today is your first day of ${eventTitle}.`

  } else {
    const daysDifference = Math.floor(
      (today - clickedDate) / (1000 * 60 * 60 * 24)
    )
    dateMessage.innerHTML = `It's been ${daysDifference} days since your ${eventTitle}.`
  }
  // if (eventTitle === 'End date') {
  //   updateDateMessage(today)
  // }
  setLocalStorage('lastMessage', { eventTitle, date })
  //loadMessage()
  
}

export function loadMessage() {
  // Update msg based on events
  updateDateMessage();
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



