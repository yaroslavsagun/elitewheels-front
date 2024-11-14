const loginForm = document.getElementById('loginForm');

async function login(email, password) {
    const data = {
        email: email,
        password: password
    }
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const access = await res.json();
    return access;
}

loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;


    if (email === '' || !isValidEmail(email)) {
        alert('Будь ласка, введіть коректну email адресу');
        return;
    }

    if (password.length < 6) {
        alert('Пароль повинен містити щонайменше 6 символів');
        return;
    }

    alert('Реєстрація успішна!');
    let result = await login(email, password);
    console.log(result);
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