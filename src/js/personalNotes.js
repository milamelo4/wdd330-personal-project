import { getLocalStorage, qs } from "./utils.mjs";

let userName = localStorage.getItem("userName");
const userId = qs("#displayUserName");
function welcomeUser() {
   const welcomeMessage = userName === "Guest" ? `Welcome Guest 🤍` : `Hello ${userName} 🤍`;

  let welcomeMsgDisplay = false;
  if (welcomeMsgDisplay) return;
  let charInx = 0;
  
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

function renderNotesEntry() {

}

welcomeUser()

//  function welcomeMsg() {
//    const userN = qs("#displayUserName");
//    if (!userN) {
//      console.error("User name display element not found");
//      return;
//    }

//    let welcomeMsgDisplay = false;
//    if (welcomeMsgDisplay) return;

//    let nameValue = getLocalStorage("userName");
//    if (!nameValue) {
//      nameValue = "Guest";
//    }

//    let charInx = 0;
//    const welcomeMessage = `Welcome ${capitalize(nameValue)}🤍`;

//    function type() {
//      if (charInx < welcomeMessage.length) {
//        userN.textContent += welcomeMessage.charAt(charInx);
//        charInx++;
//        setTimeout(type, 200);
//      } else {
//        welcomeMsgDisplay = true;
//      }
//    }

//    type();
//  }
// document.addEventListener("DOMContentLoaded", () => {
//   toggleNav();
//   // Only call welcomeMsg if the #displayUserName element exists
//   if (document.querySelector("#displayUserName")) {
//     welcomeMsg();
//   }
// });