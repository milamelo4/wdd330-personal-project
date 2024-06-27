import formatDate from "./utils";
let clicked = null

 function openModal(date) {
  clicked = formatDate(new Date(date)); // Set which day the user clicked

  console.log(`start date: ${clicked}`);
  
  const eventForDay = events.find((e) => e.date == clicked);

  if (eventForDay) {
    document.getElementById("eventText").innerHTML = eventForDay.title;
    deleteEventModal.style.display = "block";
  } else {
    newEventModal.style.display = "block";
  }
  backDrop.style.display = "block";
}

export { openModal }