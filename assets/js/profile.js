import { api_link, basic_user } from "./constants.js";

let user = []

const avatar_field = document.querySelector('.profile-photo');
const name_field = document.getElementById('fullNameInput');
const email_field = document.getElementById('emailInput');
const phone_field = document.getElementById('phoneInput');
const password_field = document.getElementById('passwordInput');

let avatar_path = '';

async function getUser() {
    const res = await fetch(api_link + `/user?Authorization=` + localStorage.getItem('token'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const data = await res.json();
    if (data.data == undefined) {
        user = basic_user;
    } else {
        user = data.data;
    }
    avatar_path = user.avatar ? user.avatar : "assets/img/profile_photo.png";
}

async function updateUser(fullName, email, phone, password) {
    const data = {
        name: fullName,
        email: email,
        phone: phone,
        password: password,
        avatar: avatar_path
    }
    console.log(data);
    const res = await fetch(api_link + '/user', {
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

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

function changeAvatar(path = avatar_path) {
    avatar_field.innerHTML = `<label for="inputAvatar">
            <img src="${path}" class="profile-photo" alt="Profile Photo">
          </label>
          <input id="inputAvatar" type="file" style="display: none">`;
}

function fillUserInfo(user) {
    changeAvatar();
    name_field.value = user.name;
    email_field.value = user.email;
    phone_field.value = user.phone;
}

document.addEventListener('DOMContentLoaded', async function () {
    await getUser();
    fillUserInfo(user);
    const saveBtn = document.getElementById('saveChangesBtn');
    const myCarsBtn = document.getElementById('myCarsBtn');
    const avatarInput = document.getElementById('inputAvatar');

    function smoothTransition(e) {
        e.preventDefault();
        document.body.style.opacity = 0;
        setTimeout(function () {
            window.location = e.target.href;
        }, 500);
    }

    if (myCarsBtn) {
        myCarsBtn.addEventListener('click', function (e) {
            e.preventDefault();
            location.href = '/mycars';
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', async function (e) {
            e.preventDefault();

            if (name_field.value === '') {
                alert('Будь ласка, введіть ваше повне ім\'я');
                return;
            }

            if (email_field.value === '' || !isValidEmail(email_field.value)) {
                alert('Будь ласка, введіть коректну email адресу');
                return;
            }

            if (phone_field.value === '' || !isValidPhone(phone_field.value)) {
                alert('Будь ласка, введіть коректний номер телефону');
                return;
            }

            if (password_field.value.length < 6) {
                alert('Пароль повинен містити щонайменше 6 символів');
                return;
            }
            updateUser(name_field.value, email_field.value, phone_field.value, password_field.value);
        });
    }

    var reader = new FileReader();
    if (avatarInput) {
        avatarInput.addEventListener('change', function (e) {
            e.preventDefault();
            let file = e.target.files[0];

            let img_field = document.querySelector(".profile-photo img");
            img_field.title = file.name;

            reader.readAsDataURL(file);

            reader.onload = function (event) {
                img_field.src = event.target.result;
                avatar_path = event.target.result;
            };
        })
    }
});