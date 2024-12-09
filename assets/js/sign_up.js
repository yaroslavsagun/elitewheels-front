const signupForm = document.getElementById('signupForm');

import { api_link } from "./constants.js";

async function createUser(fullName, email, phone, password) {
    const data = {
        name: fullName,
        email: email,
        phone: phone,
        password: password
    }
    const res = await fetch(api_link+'/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const result = await res.json();
    if (result.token) {
        localStorage.setItem('token', result.token);
        return true;
    } else {
        alert(result.message);
        return false;
    }
}

signupForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const fullName = document.getElementById('signupFullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (fullName === '') {
        alert('Будь ласка, введіть ваше повне ім\'я');
        return;
    }

    if (email === '' || !isValidEmail(email)) {
        alert('Будь ласка, введіть коректну email адресу');
        return;
    }

    if (phone === '' || !isValidPhone(phone)) {
        alert('Будь ласка, введіть коректний номер телефону');
        return;
    }

    if (password.length < 6) {
        alert('Пароль повинен містити щонайменше 6 символів');
        return;
    }

    let result = await createUser(fullName, email, phone, password);
    if (result) {
        location.href = '/';
    } else {
        return;
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}
