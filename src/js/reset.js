const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

var token = params.token;
var password = document.getElementById("password");
var confirm_password = document.getElementById("confirmPassword");
var errorMessage = document.getElementById('error');
var successMessage = document.getElementById('success');


function validatePassword() {
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords does not Match");
    return false;
  } else {
    confirm_password.setCustomValidity('');
    return true;
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

function enableSubmitButton() {
  document.getElementById('submitButton').disabled = false;
  document.getElementById('loader').style.display = 'none';
}

function disableSubmitButton() {
  document.getElementById('submitButton').disabled = true;
  document.getElementById('loader').style.display = 'unset';
}


function validateResetForm() {
  var form = document.getElementById('resetForm');
  
  for(var i=0; i < form.elements.length; i++){
      if(form.elements[i].value === '' && form.elements[i].hasAttribute('required')){
        console.log('There are some required fields!');
        return false;
      }
    }
  
  if (!validatePassword()) {
    return false;
  }
  
  reset();
}


async function reset(){
  errorMessage.innerText = '';
  successMessage.innerText = '';
  disableSubmitButton();
  
  const asyncGetCall = async () => {
    try {
      const response = await fetch('https://c582-102-89-44-199.eu.ngrok.io/beta/auth/validateForgotPassword', {
        method: 'POST',
        body: new URLSearchParams({
          token: token,
          password: password.value
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
      });
      const data = await response.json();
        enableSubmitButton();

        if(response.ok) {
          successMessage.innerHTML = data.message;
        } else {
          errorMessage.innerText = data.message;
        }
    } catch(error) {
        enableSubmitButton();
    } 
  }

  asyncGetCall()
}

enableSubmitButton()