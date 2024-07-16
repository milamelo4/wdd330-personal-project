import { getLocalStorage, qs, capitalize } from "./utils.mjs";

let userName = localStorage.getItem('userName') || 'Guest';
const userId = qs('#displayUserName');

// Set a welcome msg. If the user used the login page it should display the name else 'Guest'
function welcomeUser() {
  const welcomeMessage = `Hello ${capitalize(userName)}🤍`;

  let welcomeMsgDisplay = false;
  if (welcomeMsgDisplay) return;
  let charInx = 0;

  // Display msg typed
  function type() {
    if (charInx < welcomeMessage.length) {
      userId.textContent += welcomeMessage.charAt(charInx);
      charInx++;
      setTimeout(type, 200);
    } else {
      welcomeMsgDisplay = true;
    }
  }

  type();
}

// Create a func to display SVG of the flow intensity
function getFlowSVGs(flow) {
  const lightSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="drop-notes"><path d="M32 2C32 2 2 32 2 48C2 62 14 64 32 64C50 64 62 62 62 48C62 32 32 2 32 2Z" /></svg>';
  const mediumSVG = lightSVG + lightSVG;
  const heavySVG = lightSVG + lightSVG + lightSVG;

  if (flow === 'light') return lightSVG;
  if (flow === 'medium') return mediumSVG;
  if (flow === 'heavy') return heavySVG;
  return '';
}

// Create a template to display entries saved in localStorage
function displayNotes() {
  const notesUl = qs('#noteCard');
  notesUl.innerHTML = ''; // Clear any existing content
  let events = getLocalStorage('events') || [];

  const averageCycleDays = calculateAverageCycleDays();
  let startDate = null; // set start to null

  // for each event return a list of symptoms
  events.forEach((event) => {
    const noteLi = document.createElement('li');
    if (event.type === 'start') {
      startDate = event.date;
      const capitalizedSymptoms = event.symptoms
        .map((symptom) => capitalize(symptom))
        .join(', ');
      noteLi.innerHTML = `
      <h3 class="notesH3">Start: ${startDate} - End: ${getEndDate(events, startDate)}</h3>
      <div><strong>Cycle Length:</strong> ${averageCycleDays.toFixed(
        0
      )} days</div>
      <div><strong>Flow Intensity:</strong> ${getFlowSVGs(event.flow)}</div>
      <div><strong>Symptoms:</strong> ${capitalizedSymptoms}</div>
      <div><strong>Notes:</strong> ${capitalize(event.notes)}</div>`;
    
      notesUl.appendChild(noteLi);
    }
  });
}

function getEndDate(events, startDate) {
  for (let event of events) {
    if (event.type === 'end' && new Date(event.date) > new Date(startDate)) {
      return event.date;
    }
  }
  return 'N/A';
}

function calculateAverageCycleDays() {
  let events = getLocalStorage('events') || [];
  let cycleLengths = []; // create an array to hold all cycle lengths entered

  let startDate = null;

  events.forEach((event) => {
    if (event.type === 'start') {
      startDate = new Date(event.date); // Ste start date to event date
    } 
    
    else if (event.type === 'end' && startDate) {
      const endDate = new Date(event.date);
      const cycleLength = (endDate - startDate) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
      cycleLengths.push(cycleLength);
      startDate = null; // Reset startDate for the next cycle
    }
  });

  if (cycleLengths.length === 0) {
    return 0; // Nothing to display
  }
  // Get length
  const totalCycleLength = cycleLengths.reduce(
    (acc, length) => acc + length,
    0
  );
  return totalCycleLength / cycleLengths.length
}

welcomeUser();
displayNotes();

