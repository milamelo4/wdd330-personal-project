import { setContent, getSymptoms, capitalize } from "./utils.mjs"

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

function getMenstrualPhaseMessage(startDate, currentDate) {
  // Number of milliseconds in one day
  const msInDay = 24 * 60 * 60 * 1000
  // Calculate the difference in days
  const daysDifference = Math.floor((currentDate - startDate) / msInDay)

  if (daysDifference === 0) {
    return 'Today is your first day.'

  } else if (daysDifference > 0 && daysDifference <= 5) {
    return `Today is day ${daysDifference + 1} of your period.`

  } else if (daysDifference > 5 && daysDifference <= 14) {
    return `Today is day ${ daysDifference + 1 }. You are in the follicular phase.`

  } else if (daysDifference > 14 && daysDifference <= 21) {
    return `Today is day ${
      daysDifference + 1 }. You are in the ovulation phase.`

  } else if (daysDifference > 21 && daysDifference <= 28) {
    return `Today is day ${daysDifference + 1}. You are in the luteal phase.`

  } else {
    return `Today is day ${daysDifference + 1} of your cycle.`
  }
}

export function updateDateMessage(date) {
  const startDate = new Date(date)
  const currentDate = new Date()
  const message = getMenstrualPhaseMessage(startDate, currentDate)
  return setContent('#dateMessage', `Date: ${date} - ${message}`)
}
