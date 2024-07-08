import { setContent, getSymptoms, capitalize, getLocalStorage, qs } from "./utils.mjs"

export async function renderSymptoms() {
  const symptomsList = await getSymptoms()
  const { emotions, physical_symptoms } = symptomsList.symptoms
  

  let contentEmotions = `<legend>Emotions</legend>`
  emotions.forEach((emotion) => {
    contentEmotions += `
    <label>
      <input type="checkbox" name="symptom" value="${emotion}">
      ${capitalize(emotion)}
    </label>`
    
    
  })

  let contentPhysical = `<legend>Physical</legend>`;
  physical_symptoms.forEach((symptom) => {
    contentPhysical += `
    <label>
      <input type="checkbox" name="symptom" value="${symptom}">
      ${capitalize(symptom)}
    </label><br>`
    
  })
  
  
  return (
    setContent('#emotionForm', contentEmotions),
    setContent('#physicalForm', contentPhysical)
  )
  
}

function getMenstrualPhaseMessage(endDate, startDate, currentDate) {
  // Number of milliseconds in one day
  const msInDay = 24 * 60 * 60 * 1000;
  // Calculate the difference in days
  const daysDifference = Math.floor((currentDate - startDate) / msInDay)
  const cycleLength = Math.floor((endDate - startDate) / msInDay) + 1

  if (daysDifference < 0) {
    return 'The start date is in the future.'
  }

  if (daysDifference === 0) {
    return 'Today is your first day.'
  }

  if (daysDifference <= 5) {
    return `Today is day ${daysDifference + 1} of your period.`
  }

  if (daysDifference <= 14) {
    return `Today is day ${
      daysDifference + 1
    }. You are in the follicular phase.`
  }

  if (daysDifference <= 21) {
    return `Today is day ${
      daysDifference + 1
    }. You are in the ovulation phase.`
  }

  if (daysDifference <= 28) {
    return `Today is day ${daysDifference + 1}. You are in the luteal phase.`
  }

  if (daysDifference > 28 && daysDifference < cycleLength) {
    return `Today is day ${daysDifference + 1} of your cycle.`
  }

  return 'Your cycle has ended.'
}

export function updateDateMessage(date) {
  const startDateString = getLocalStorage('startDate')
  let endDateString = getLocalStorage('endDate')
  const currentDate = new Date()

  if (!startDateString) {
    return setContent("#dateMessage", "Start date not set.");
  }

  

  const startDate = new Date(startDateString)
  let endDate = endDateString ? new Date(endDateString) : null

  if (!endDate) {
    // If end date is not set, use a default cycle length to give a meaningful message
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 28); // Assuming a default cycle length of 28 days
  }

  const message = getMenstrualPhaseMessage(startDate, endDate, currentDate)
  return setContent(
    "#dateMessage",
    `Date: ${currentDate.toLocaleDateString()} - ${message}`
  );
}
