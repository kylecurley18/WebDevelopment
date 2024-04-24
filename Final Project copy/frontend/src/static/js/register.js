import api from './APIClient.js';

const form = document.getElementById('form');
const usrname = document.getElementById('username');
const emailInput = document.getElementById('email');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const pass = document.getElementById('password');
const pass2 = document.getElementById('password2');

const errorBox = document.getElementById('errorBox');

form.addEventListener('submit', e => {
    e.preventDefault();

    if (!validateInputs()) {
        return;
    }

    const username = usrname.value;

    const first_name = firstName.value;

    const last_name = lastName.value;

    const password = pass.value;

    const email = emailInput.value;

    api.postUser(username, first_name, last_name, password, email).then((userData) => {
        console.log(userData);
        document.location = './login'; // Redirect to login page after successful login
    }).catch((err) => {
        if (err.status == 406) {
            errorBox.innerHTML = "User name already exists";
        }
        else {
            errorBox.innerHTML = err;
        }
    });
});

usrname.addEventListener('input', () => {
    validateInputs();
});

usrname.addEventListener('blur', () => {
    validateInputs();
});

emailInput.addEventListener('input', () => {
    validateInputs();
});

emailInput.addEventListener('blur', () => {
    validateInputs();
});

firstName.addEventListener('input', () => {
    validateInputs();
});

firstName.addEventListener('blur', () => {
    validateInputs();
});

lastName.addEventListener('input', () => {
    validateInputs();
});

lastName.addEventListener('blur', () => {
    validateInputs();
});

pass.addEventListener('input', () => {
    validateInputs();
});

pass.addEventListener('blur', () => {
    validateInputs();
});

pass2.addEventListener('input', () => {
    validateInputs();
});

pass2.addEventListener('blur', () => {
    validateInputs();
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
}

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateInputs = () => {
    const usernameValue = usrname.value.trim();
    const emailValue = emailInput.value.trim();
    const passwordValue = pass.value.trim();
    const password2Value = pass2.value.trim();
    const firstNameValue = firstName.value.trim();
    const lastNameValue = lastName.value.trim();

    errorBox.innerHTML = '';

    let valid = true;

    if (usernameValue === '') {
        setError(usrname, 'Username is required');
        valid = false;
    } else {
        setSuccess(usrname);
    }

    if (firstNameValue === '') {
        setError(firstName, 'First Name is required');
        valid = false;
    } else {
        setSuccess(firstName);
    }

    if (lastNameValue === '') {
        setError(lastName, 'Last Name is required');
        valid = false;
    } else {
        setSuccess(lastName);
    }

    if (emailValue === '') {
        setError(emailInput, 'Email is required');
        valid = false;
    } else if (!isValidEmail(emailValue)) {
        setError(emailInput, 'Provide a vaild email address');
        valid = false;
    } else {
        setSuccess(emailInput);
    }

    if (passwordValue === '') {
        setError(pass, 'Password is required');
        valid = false;
    } else if (passwordValue.length < 8) {
        setError(pass, 'Password must be at least 8 character.');
        valid = false;
    } else {
        setSuccess(pass);
    }

    if (password2Value === '') {
        setError(pass2, 'Please confirm your password');
        valid = false;
    } else if (password2Value !== passwordValue) {
        setError(pass2, "Passwords don't match");
        valid = false;
    } else {
        setSuccess(pass2);
    }

    return valid;

}