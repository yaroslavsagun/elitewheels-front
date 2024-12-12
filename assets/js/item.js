import { api_link, img_link } from "./constants.js";

function getId() {
    const data = window.location.search;
    const urlParams = new URLSearchParams(data);
    const id = urlParams.get('id');
    return id;
}

var car = [];

async function getCar() {
    const res = await fetch(api_link + '/cars/' + getId(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const data = await res.json();
    console.log(data);
    if (data.data == undefined) {
        alert('There is no such car');
        location.href = '/';
    } else {
        car = data.data;
    }
}

function createCarHeader() {
    console.log(car);
    const car_header = document.querySelector('.item-header');
    car_header.innerHTML =
        `<div class="item-info">
            <h1>${car.name}</h1>
            <h2 class="item-brand">${car.brand.name.toUpperCase()}</h2>
            <p class="item-price">${car.price}$/day</p>
        </div>`

    let specials = [
        { name: "ENGINE", value: car.engine },
        { name: "0-100 KM/H", value: car.time_to_100 + " sec" },
        { name: "MAX SPEED", value: car.max_speed + "km/h" },
        { name: "MAXIMUM POWER", value: car.max_power + "CV" },
        { name: "POWER PER LITER", value: car.power_per_liter + "cv/l" }
    ];
    specials = specials.filter(special => !!special.value);

    if (specials != []) {
        car_header.innerHTML += `<div class="item-specs">` +
            specials.map(special => `
                <div class="spec">
                    <h3>${special.value}</h3>
                    <p>${special.name}</p>
                </div>`).join('') + `</div>`
    }

    car_header.innerHTML +=
    `<div class="item-image">
        <img src="${car.main_image != null ? img_link+car.main_image.path : "assets/img/blank_car.png"}" 
        alt="${car.brand.name} ${car.type.name}">
    </div>`
}

function createPhotoList() {
    const car_gallery = document.querySelector('.item-gallery');
    let images = car.images;
    car_gallery.innerHTML = images.map(image => `<img src="${img_link}${image.path}" alt="${car.name}"></img>`).join('');
}

function createInfo() {
    const info = document.querySelector('.item-description');
    info.innerHTML = `<p>${car.description}</p>`;

    const contact = document.querySelector('.contact-description');
    contact.innerHTML = `
    <table>
        <tr>
            <th>Full name:</th>
            <td>${car.author.name}</td>
        </tr>
        <tr>
            <th>Email:</th>
            <td>${car.author.email}</td>
        </tr>
        <tr>
            <th>Phone number:</th>
            <td>${car.author.phone}</td>
        </tr>
    </table>`
}

document.addEventListener('DOMContentLoaded', async function () {
    await getCar();
    createCarHeader();
    createPhotoList();
    createInfo();
});