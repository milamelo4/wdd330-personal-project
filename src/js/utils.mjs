
// retrieve data from localStorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

//
// export function formatDate(date) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// }

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { timeZone: "UTC" });
}

// capitalize first letter of a word function
export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span title="Close">X</span>`;

  alert.addEventListener("click", function (event) {
    if (event.target.tagName == "SPAN") {
      main.removeChild(this);
    }
  });
  const main = document.querySelector("main");
  main.prepend(alert);
  // make sure they see the alert by scrolling to the top of the window
  //we may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if (scroll) window.scrollTo(0, 0);

  // left this here to show how you could remove the alert automatically after a certain amount of time.
  setTimeout(function () {
    main.removeChild(alert);
  }, duration);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}

// wrapper for querySelector...returns matching element
export function qs(selector) {
  return document.querySelector(selector);
}
export function setContent(selector, content) {
  qs(selector).innerHTML = content;
}

export function getDateInfo(dt) {
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1);

  //console.log(dateString); // Saturday, 6/1/2024. We need the long format for week name.
  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
   
  });

  return {
    day,
    month,
    year,
    daysInMonth,
    firstDayOfMonth,
    dateString,
  };
}
