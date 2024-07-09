
import {
  qs,
  capitalize,
  getLocalStorage,
} from "./utils.mjs";

export async function renderWithTemplate(
  templateFn,
  parentElement,
  data,
  callback,
  position = "afterbegin",
  clear = true
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlString = await templateFn(data);
  parentElement.insertAdjacentHTML(position, htmlString);
  if (callback) {
    callback(data);
  }
}

function loadTemplate(path) {
  // wait what?  we are returning a new function?
  // this is called currying and can be very helpful.
  return async function () {
    const res = await fetch(path);
    if (res.ok) {
      const html = await res.text();
      return html;
    }
  };
}

export async function loadHeaderFooter() {
  const headerTemplateFn = loadTemplate("./partials/header.html");
  //const footerTemplateFn = loadTemplate("/partials/footer.html");
  const headerEl = document.querySelector("#main-header");
  //const footerEl = document.querySelector("#main-footer");
  await renderWithTemplate(headerTemplateFn, headerEl);
    console.log("Header loaded and rendered.");
  //renderWithTemplate(footerTemplateFn, footerEl);
  toggleNav();
  welcomeMsg();
}

export function toggleNav() {
  let menuIcon = qs("#menu-icon");
  let navContainer = qs("#nav-container");

  if (menuIcon && navContainer) {
    menuIcon.addEventListener("click", function () {
      navContainer.classList.toggle("open");
      menuIcon.classList.toggle("open");
    });
  } else {
    console.warn("Menu icon or navigation container not found");
  }
}

 function welcomeMsg() {
  const userN = qs("#userName")
  let welcomeMsgDisplay = false
  if (welcomeMsgDisplay) return

  // welcome guest
  const nameValue = getLocalStorage("userName") || "Guest";
  if(!nameValue) {
    userN.textContent = "Welcome Guest 🤍";
    return
  }

  let charInx = 0;
  const welcomeMessage = `Welcome ${capitalize(nameValue)}🤍`

  function type() {
    if (charInx < welcomeMessage.length) {
      userN.textContent += welcomeMessage.charAt(charInx)
      charInx++
      setTimeout(type, 200)
    } else {
      welcomeMsgDisplay = true
    } // Don't display msg again
  }

  // call the function
  type()
}

loadHeaderFooter()


