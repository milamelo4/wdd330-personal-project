import { load } from "./calendar.js";
import { formatDate, setLocalStorage, qs, getLocalStorage } from "./utils.mjs";

let clicked = null
const newEventModal = qs('#newEventModal')
const deleteEventModal = qs('#deleteEventModal')
const backDrop = qs('#modalBackDrop')



let events = getLocalStorage('events') || []
 export function openModal(date) {
  clicked = formatDate(new Date(date)) // Set which day the user clicked
  //alert('ok')
  //console.log(`start date: ${clicked}`)
  const eventForDay = events.find((e) => e.date == clicked)

  if (eventForDay) {
    qs('#eventText').innerHTML = eventForDay.title
    deleteEventModal.style.display = 'block'
  } else {
    newEventModal.style.display = 'block'
  }
  backDrop.style.display = 'block'
}

export function saveEvent() {
  const eventTitleInput = qs("#eventTitleInput")
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error')
    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });
    setLocalStorage('events', events); // Save events to localStorage
    closeModal()
    load() // Reload the calendar to reflect the new event
  } else {
    eventTitleInput.classList.add('error')
  }
}

export function closeModal() {
  const eventTitleInput = qs('#eventTitleInput');
  eventTitleInput.classList.remove('error')
  newEventModal.style.display = 'none'
  deleteEventModal.style.display = 'none'
  backDrop.style.display = 'none'
  eventTitleInput.value = ''
  clicked = null
  load()
}

export function deleteEvent() {
  events = events.filter((e) => e.date !== clicked)
  setLocalStorage("events", events);
  //  load();
  closeModal()
}



