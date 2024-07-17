import {
  openModal,
  saveEvent,
  deleteEvent,
  closeModal,
  cancelEvent
} from './modal.mjs';

import {
  getLocalStorage,
  qs,
  setContent,
  getDateInfo,
} from './utils.mjs';

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const calendar = qs('#calendar')
 let nav = 0;

function addEventClassToRange(startDate, endDate, currentMonth, currentYear) {
  const currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + 1); // Move to the day after the start date
  while (currentDate <= endDate) {
    const dayString = `${
      currentDate.getMonth() + 1
    }/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    if (
      currentDate.getMonth() === currentMonth &&
      currentDate.getFullYear() === currentYear
    ) {
      const daySquare = qs(`[data-date='${dayString}']`);
      if (daySquare) {
        daySquare.classList.add('event-range');
      } 
      else {
        console.warn(`No daySquare found for ${dayString}`)
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

// Load calendar
export function load() { 
  let events = getLocalStorage('events') || [];
  
  const dt = new Date();
  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const { day, month, year, daysInMonth, firstDayOfMonth, dateString } = getDateInfo(dt);

  setContent('#monthDisplay', `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`);
  const paddingDays = weekdays.indexOf(dateString);

  calendar.innerHTML = ''; // Reset calendar
  
  for (let i = 0; i < paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    if (i >= paddingDays) {
      const dayOfMonth = i - paddingDays + 1;
      const dayString = `${month + 1}/${dayOfMonth}/${year}`;
      daySquare.setAttribute('data-date', dayString);
      daySquare.innerHTML = dayOfMonth;
      //console.log(`Setting data-date: ${dayString}`)
      
      const eventForDay = events.find((e) => e.date === dayString);
        // console.log(`Checking events for: ${dayString}`, eventForDay)

      if (dayOfMonth === day && month === new Date().getMonth()) {
        daySquare.classList.add('currentDay');
      }
      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        
        eventDiv.innerHTML = eventForDay.title;
        daySquare.appendChild(eventDiv);
        
      }  
      // call openModal
      daySquare.onclick = () => {
        openModal(dayString);
      };
    } 
    else {
      daySquare.classList.add('padding');
    }
    // append days of the month to calendar
    calendar.appendChild(daySquare);
  };

  // check each event call range function
  events.forEach((event) => {
    if (event.type === 'start') {
      const endEvent = events.find(
        (e) => e.type === 'end' && new Date(e.date) >= new Date(event.date)
      );
      if (endEvent) {
        addEventClassToRange(new Date(event.date), new Date(endEvent.date), month, year);
      }
    }
  });
}

// Initialize buttons
export function initBtn() {
  qs("#nextButton").onclick = () => { nav++; load();};
  qs("#backButton").onclick = () => {
    nav--;
    load();
  };
  qs("#cancelButton").onclick = () => cancelEvent();
  qs("#saveButton").onclick = () => {saveEvent();
  load()}; //
  
  qs("#deleteButton").onclick = () => deleteEvent();
  qs("#closeButton").onclick = () => closeModal();
}


