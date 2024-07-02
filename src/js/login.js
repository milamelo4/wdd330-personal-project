import { qs, setLocalStorage } from "./utils.mjs"

const loginForm = qs('#loginForm')
const userName = qs('#userName')
const userEmail = qs('#email')
const emailError = qs('#email + span.error')



// check email
userEmail.addEventListener('input', (e) => {
  const s = new URLSearchParams('userName')
  console.log(s)
    if (userEmail.validity.valid) {
        emailError.textContent = ''
        emailError.className = 'error'
    } else {
        showEmailError()
    }
})

loginForm.addEventListener("submit", function (event) {
  event.preventDefault()
  if (this.checkValidity()) {
    const user = userName.value;
    setLocalStorage("userName", user)

    // Direct user to calendar
    window.location.href = "../index.html"
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
  