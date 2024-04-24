import api from './APIClient.js';

const form = document.getElementById('loginForm');
const username = document.getElementById('username');
const password = document.getElementById('password');

const errorBox = document.getElementById('errorBox');

form.addEventListener('submit', e => {
    e.preventDefault();

    if (!validateInputs()) {
        return;
    }

    const userName = username.value.trim();
    const userPass = password.value.trim();

    api.logIn(userName, userPass).then((userData) => {
        document.location = './'; // Redirect to main page after successful login
    }).catch((err) => {
        if (err.status === 401) {
            errorBox.innerHTML = "User not found";
        }
        else {
            errorBox.innerHTML = err;
        }
    });
});

username.addEventListener('input', () => {
    validateInputs();
});

username.addEventListener('blur', () => {
    validateInputs();
});

password.addEventListener('input', () => {
    validateInputs();
});

password.addEventListener('blur', () => {
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

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();

    errorBox.innerHTML = '';

    let valid = true;

    if (usernameValue === '') {
        setError(username, 'Username is required');
        valid = false;
    } else {
        setSuccess(username);
    }

    if (passwordValue === '') {
        setError(password, 'Password is required');
        valid = false;
    } else if (passwordValue.length < 8) {
        setError(password, 'Password must be at least 8 character.');
        valid = false;
    } else {
        setSuccess(password);
    }

    return valid;

}