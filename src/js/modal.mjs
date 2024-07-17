import { load } from "./calendar.mjs";
import {
  setLocalStorage,
  qs,
  getLocalStorage, 
  alertMessage, 
  setContent
} from "./utils.mjs";
import {
  updateDateMessage,
  renderSymptoms,
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
  
  // Check for event
  if (eventForDay) {
    qs('#eventText').innerHTML = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } 
  else {
    newEventModal.style.display = 'block';
  }

  backDrop.style.display = 'block';
  qs('#menu-icon').style.display = 'none';
  
  renderSymptoms(); // Render list of symptoms
 }

export function saveEvent() {
  let events = getLocalStorage('events') || [];
  const startPeriodInput = qs('#startPeriod');
  const endPeriodInput = qs('#endPeriod');
  let eventTitle = '';
  let eventType = '';
  const eventTitleInput = qs('#eventTitleInput');

  // Check flow
  const selectedFlow = qs('input[name="flow"]:checked');
  const flowIntensity = selectedFlow ? selectedFlow.value : null; // Return null if not entered

  // If start date selected
  if (startPeriodInput.checked) {
    eventTitle = 'Start period';
    eventType = 'start';
    setLocalStorage('startDate', clicked); // Set to localStorage
    alertMessage(eventTitle); // Alert event
  } 
  else if (endPeriodInput.checked) {
    eventTitle = 'End period';
    eventType = 'end';
    setLocalStorage('endDate', clicked);
    alertMessage(eventTitle);
  } 
  else if (eventTitleInput.value.trim() === '') {
    eventTitleInput.classList.add('error');
    console.log('Error: Event title is required.');
    return;
  }

  // Save symptoms to localStorage. Create an array to deal with JSON object
  const selectedSymptoms = Array.from(
    document.querySelectorAll('input[name="symptom"]:checked')
  ).map((input) => input.value);

  // Save events to array
  events.push({
    date: clicked,
    title: eventTitle,
    type: eventType,
    symptoms: selectedSymptoms,
    flow: flowIntensity,
    notes: eventTitleInput.value.trim(),
  });

  setLocalStorage('events', events); // Save events to localStorage

  if (eventTitle === 'Start period' || eventTitle === 'End period') {
    displayMessage(eventTitle, clicked); // Display the message
  }

  // close modal
  closeModal();
  // load the calendar to reflect the new event
  load();
}

export function deleteEvent() {
  let events = getLocalStorage('events') || [];
  // check which event was clicked
  const eventToDelete = events.find((e) => e.date === clicked);

  if (eventToDelete) {
    if (eventToDelete.type === 'start') {
      localStorage.removeItem('startDate');
      alertMessage('Start date removed');
    } 
    else if (eventToDelete.type === 'end') {
      localStorage.removeItem('endDate');
      alertMessage('End date removed');
    }
  }

  events = events.filter((e) => e.date !== clicked);
  setLocalStorage('events', events); // set localStorage
  clearMessage(); // clear msg
  closeModal(); // close modal
  load(); // reset

  // Update the message based on the remaining start and end dates
  const startDateString = getLocalStorage('startDate');
  let endDateString = getLocalStorage('endDate');

  if (startDateString) {
    updateDateMessage(new Date()); // Update message based on the current date
  } 
  else {
    setContent('#dateMessage', 'Start date not set.');
  }
}

export function cancelEvent() {
  clicked = null; // set clicked date to null
  closeModal(); // Close
  load(); // Reset
}

function displayMessage(eventTitle, date) {
  const today = new Date();
  const clickedDate = new Date(date);
  //console.log(clickedDate);
  if (clickedDate.toDateString() === today.toDateString()) {
    dateMessage.innerHTML = `Today is your first day of ${eventTitle}.`;
  } else {
    const daysDifference = Math.floor(
      (today - clickedDate) / (1000 * 60 * 60 * 24)
    );
    dateMessage.innerHTML = `It's been ${daysDifference} days since your ${eventTitle}.`;
  }
  // save msg to localStorage
  setLocalStorage("lastMessage", { eventTitle, date });
  updateDateMessage();
}

export function loadMessage() {
  const lastMessage = getLocalStorage('lastMessage');
  if (lastMessage) {
    updateDateMessage(lastMessage.date);
  } 
  else {
    setContent('#dateMessage', '<li>Start date not set.</li>'); // Clear the message if there is no last message
  }
}

function clearMessage() {
  //dateMessage.innerHTML = ''
  setLocalStorage('lastMessage', null);
  // setLocalStorage("startDate", null);
  updateDateMessage();
}

export function closeModal() {
  const eventTitleInput = qs('#eventTitleInput');
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  qs('#menu-icon').style.display = 'flex';
}



