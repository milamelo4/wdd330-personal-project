import {
  setContent,
  getSymptoms,
  capitalize,
  getLocalStorage,
  setLocalStorage,
} from "./utils.mjs";

// Fetch JSON and render dynamic form elements
export async function renderSymptoms() {
  const symptomsList = await getSymptoms();
  const { emotions, physical_symptoms } = symptomsList.symptoms;

  // create a template
  let contentEmotions = `<legend>Emotions</legend>`;
  emotions.forEach((emotion) => {
    contentEmotions += `
    <label class="radio">
      <input type="checkbox" name="symptom" value="${emotion}">
      ${capitalize(emotion)}
    </label>`;
  });


  // Create form with all symptoms
  let contentPhysical = `<legend>Physical</legend>`;
  physical_symptoms.forEach((symptom) => {
    contentPhysical += `
    <label class="radio">
      <input type="checkbox" name="symptom" value="${symptom}">
      ${capitalize(symptom)}
    </label><br>`
  });
  
  return (
    setContent('#emotionForm', contentEmotions),
    setContent('#physicalForm', contentPhysical)
  );
}

// Get different phases based on startDate, endDate and currentDate
export function getMenstrualPhaseMessage(endDate, startDate, currentDate) {
  // Number of milliseconds in one day
  const msInDay = 24 * 60 * 60 * 1000;
  //console.log(`msInDay ${msInDay}`);
   const averageCycleLength = 28;
  // Calculate the difference in days
  const daysSinceEnd = Math.floor((currentDate - startDate) / msInDay);

  const daysSinceStart = Math.floor((currentDate - endDate) / msInDay);

  // Calculate prediction to next period based on the cycle length average of 28 days.
  const nextPeriodStartDate = new Date(
    startDate.getTime() + averageCycleLength * msInDay
  );
  const nextPeriodMessage = `Your next period is expected to start on ${nextPeriodStartDate.toLocaleDateString(
    "en-US",
    { year: "numeric", month: "2-digit", day: "2-digit" } // Changed to this format to display correct date on mobile.
  )}`;
  
  // return cycle phase based on start end and current date
  if (daysSinceStart >= 0 && daysSinceStart <= 5 ) {
    return `<li>Today is day ${daysSinceStart + 1} of your period.</li> 
    <li>${nextPeriodMessage}</li>`;
  } 
  else if (daysSinceStart > 5 && daysSinceStart <= 14) {
    return `<li>Today is day ${daysSinceStart + 1} of this cycle.</li> 
    <li>You are in the follicular phase.</li>
    <li>${nextPeriodMessage}</li>`;
  } 
  else if (daysSinceStart > 14 && daysSinceStart <= 21 ) {
    return `<li>Today is day ${daysSinceStart + 1} of this cycle.</li>
     <li>You are in the ovulation phase.</li>
     <li>${nextPeriodMessage}</li>`;
  } 
  else if (daysSinceStart > 21 && daysSinceStart <= 28) {
    return `<li>Today is day ${daysSinceStart + 1} of this cycle.</li>  
    <li>You are in the luteal phase.</li> 
    <li>${nextPeriodMessage}</li>`;
  } 
  else if (daysSinceEnd > 0) {
    return `<li>It's been ${daysSinceEnd} days since your period ended. </li> 
    <li>${nextPeriodMessage}</li>`;
  } 
}

// Update calendar msg based on startDate, endDate and currentDate
export function updateDateMessage() {
  const startDateString = getLocalStorage('startDate');
  let endDateString = getLocalStorage('endDate');
  const currentDate = new Date();
  // console.log(`currentDates ${currentDate}`);

  if (!startDateString) {
    return setContent('#dateMessage', '<li>Dates not set.</li>');
  }

  const startDate = new Date(startDateString);
  let endDate = endDateString ? new Date(endDateString) : null;

  if (!endDate) {
    // If end date is not set, use a default cycle length
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 28); // Assuming a default cycle length of 28 days
  }

  // Call function set msg
  const message = getMenstrualPhaseMessage(startDate, endDate, currentDate);
  setContent('#dateMessage', `${message}`);
  // Save the last message to localStorage
  setLocalStorage('lastMessage', { date: currentDate });
}
