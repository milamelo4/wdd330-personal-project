export function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  if (value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(`Error parsing JSON for key "${key}":`, error);
      return null;
    }
  }
  return null;
}

export function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", { timeZone: "UTC" });
  return { formattedDate, date };
}

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
  if (scroll) window.scrollTo(0, 0);
  setTimeout(function () {
    main.removeChild(alert);
  }, duration);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}

export function qs(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element not found for selector: ${selector}`);
  }
  return element;
}

export function setContent(selector, content) {
  const element = qs(selector);
  if (element) {
    element.innerHTML = content;
  }
}

export function getDateInfo(dt) {
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1);
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

async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw { name: "servicesError", message: data };
  }
}

export async function getSymptoms() {
  const response = await fetch("./json/emotions.json");
  const symptoms = await convertToJson(response);
  return symptoms;
}
