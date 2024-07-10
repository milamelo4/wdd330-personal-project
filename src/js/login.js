import { qs, setLocalStorage } from "./utils.mjs";


const loginForm = qs('#loginForm')
const userName = qs('#userName')
const userEmail = qs('#email')
const emailError = qs('#email + span.error')



// check email
userEmail.addEventListener('input', (e) => {
  
    if (userEmail.validity.valid) {
        emailError.textContent = ''
        emailError.className = 'error'
    } else {
        showEmailError()
    }
})

loginForm.addEventListener("submit", function (event) {
  event.preventDefault()
  const user = userName.value;
  localStorage.setItem("userName", user);
  if (this.checkValidity()) {
    

    // Direct user to calendar
    window.location.href = "../personalEntry/index.html";
  }
   else {
    this.reportValidity()
  }
})


function showEmailError() {
  if (userEmail.validity.valueMissing) {
    emailError.innerHTML = 'You need to enter a valid email address'

  } else if (userEmail.typeMismatch) {
    emailError.innerHTML = 'Entered value needs to be an email address.'

  } else if (userEmail.validity.patternMismatch) {
    emailError.innerHTML = 'Please enter a valid email address format.'

  } else if (userEmail.validity.tooShort) {
    emailError.innerHTML = `Email should be at least ${email.minLength} characters; you entered ${email.value.length}.`

  }
    emailError.className = 'error active'
}
  