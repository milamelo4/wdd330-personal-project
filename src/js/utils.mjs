export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', { timeZone: 'UTC' });
  return { formattedDate, date };
}

export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function alertMessage(message, scroll = true, duration = 3500) {
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.classList.add('bg');
  alert.innerHTML = `<p>${message}</p><span title="Close">X</span>`;

  alert.addEventListener('click', function (event) {
    if (event.target.tagName == 'SPAN') {
      main.removeChild(this);
    }
  });

  const main = document.querySelector('main');
  main.prepend(alert);
  if (scroll) window.scrollTo(0, 0);

  setTimeout(function () {
    alert.classList.add('fade-out');
    main.removeChild(alert);
  }, duration - 500);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll('.alert');
  alerts.classList.add('fade-out');
  alerts.forEach((alert) => document.querySelector('main').removeChild(alert));
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
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
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
  } 
  else {
    throw { name: 'servicesError', message: data };
  }
}

export async function getSymptoms() {
  try {
    const response = await fetch("./json/emotions.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const symptoms = await convertToJson(response);
    return symptoms;
  } catch (error) {
    console.error("Failed to fetch symptoms:", error);
    // Handle the error returning a default value or rethrowing the error
    return null;
  }
}
