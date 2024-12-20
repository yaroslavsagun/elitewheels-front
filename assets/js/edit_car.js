import { api_link, img_link } from "./constants.js";

const name_field = document.getElementById('model-input');
const price_field = document.getElementById('price-input');
const description_field = document.getElementById('about-input');
const engine_field = document.getElementById('engine-input');
const acceleration_field = document.getElementById('acceleration-input');
const speed_field = document.getElementById('speed-input');
const power_field = document.getElementById('power-input');
const power_liter_field = document.getElementById('power-liter-input');

const imageInput = document.querySelector('.left-section');

let id = null;

function getId() {
    const data = window.location.search;
    const urlParams = new URLSearchParams(data);
    id = urlParams.get('id');
}

var car = [];

let manufacturer_id = null;
let type_id = null;
let color = null;

const formData = new FormData();
let manufacturers = [];
let types = [];

async function getManufacturers() {
    const res = await fetch(api_link + `/brands`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const data = await res.json();
    if (data.data == undefined) {
        manufacturers = [];
    } else {
        manufacturers = data.data;
    }
}

async function getTypes() {
    const res = await fetch(api_link + `/types`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const data = await res.json();
    if (data.data == undefined) {
        types = [];
    } else {
        types = data.data;
    }
}

async function getCar() {
    const res = await fetch(api_link + '/cars/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const data = await res.json();
    if (data.data == undefined) {
        alert('There is no such car');
        location.href = '/';
    } else {
        car = data.data;
    }
}

async function updateCar(id, data) {
    const res = await fetch(api_link + `/cars/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const result = await res.json();
}

async function updateImage(id) {
    console.log(formData.get('main_image'));
    const res = await fetch(api_link + `/cars/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'image/png',
            'Accept': 'application/json'
        },
        body: formData
    });
    const result = await res.json();
    console.log(result);
}

async function addCar(data) {
    const res = await fetch(api_link + '/cars', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const result = await res.json();
    return result.data.id;
}

function gatherData() {

    let data = {
        name: name_field.value,
        brand_id: manufacturer_id,
        color: color == null ? null : color.value,
        type_id: type_id,
        price: price_field.value,
        description: description_field.value,
        engine: engine_field.value,
        time_to_100: acceleration_field.value,
        max_speed: speed_field.value,
        max_power: power_field.value,
        power_per_liter: power_liter_field.value,
        main_image: null
    }
    
    return data;
}

async function createCarInfo() {
    await getManufacturers();
    await getTypes();
    
    const manufacturer_radio = document.querySelector('.manufacturers-list');

    manufacturer_radio.innerHTML = manufacturers.map(manufacturer =>
        `<div class="manufacturer-item" id="${manufacturer.id}">
            <input type="radio" name="make" id="${manufacturer.id}" value="${manufacturer.name}">
            <label for="${manufacturer.id}">${manufacturer.name}</label>
        </div>`).join('');

    manufacturer_radio.addEventListener('change', function (event) {
        if (event.target.closest('input')) {
            let element = event.target.closest('input');
            manufacturer_id = element.id;
        }
    })

    const types_radio = document.querySelector('.type-elements');

    types_radio.innerHTML = types.map(type =>
        `<div class="type-element" id="${type.id}">
            <input type="radio" name="type" id="${type.id}" value="${type.name}">
            <label for="${type.id}">${type.name}</label>
        </div>`).join('');

    types_radio.addEventListener('change', function (event) {
        if (event.target.closest('input')) {
            let element = event.target.closest('input');
            type_id = element.id;
        }
    });
}

function fillCarInfo(car) {
    name_field.value = car.name;
    price_field.value = car.price;
    description_field.value = car.description;
    engine_field.value = car.engine;
    acceleration_field.value = car.time_to_100;
    speed_field.value = car.max_speed;
    power_field.value = car.max_power;
    power_liter_field.value = car.power_per_liter;

    imageInput.innerHTML =
                    `<label for="main_image" class="upload-label">
                        <img src="${car.main_image != null ? img_link+car.main_image.path : "assets/img/blank_car.png"}" 
                        alt="Car Image" class="center">
                    </label>
                    <input type="file" id="main_image" style="display: none;">`;

    let picked_color = document.querySelector(`[data-color="#${car.color.toUpperCase()}"]`);
    picked_color.classList.toggle('selected');

    color = {
        button: picked_color.className,
        value: car.color
    }

    document.querySelector(`.type-element[id='${car.type.id}'] input`).checked = true;
    type_id = car.type.id;

    document.querySelector(`.manufacturer-item[id='${car.type.id}'] input`).checked = true;
    manufacturer_id = car.type.id;
}

document.addEventListener('DOMContentLoaded', async function () {
    getId();
    await createCarInfo();

    if (id != null) {
        await getCar();
        fillCarInfo(car);
    }

    const add_btn = document.querySelector('.submit-btn');
    if (add_btn) {
        add_btn.addEventListener('click', async function () {
            let data = gatherData();
            if (id != null) {
                await updateCar(id, data);
            } else {
                id = await addCar(data);
            }
            await updateImage(id);
            location.href = '/mycars';
        })
    }

    var reader = new FileReader();
    if (imageInput) {
        imageInput.addEventListener('change', function (e) {
            e.preventDefault();
            let file = e.target.files[0];

            formData.append('main_image', file);

            reader.readAsDataURL(file);

            reader.onload = function (event) {
                let path = event.target.result;
                imageInput.innerHTML =
                    `<label for="mainPhoto" class="upload-label">
                        <img src="${path}" alt="Car Image" class="center">
                    </label>
                    <input type="file" id="mainPhoto" accept="image/*" style="display: none;">`;
            };
        })
    }

    const color_group = document.querySelector('.color-options');

    color_group.addEventListener('click', function (event) {
        if (event.target.closest('button')) {
            if (color != null) {
                let element = document.getElementsByClassName(`${color.button}`)[0];
                element.classList.toggle('selected');
            }
            let value = event.target.closest('button').dataset.color
            color = {
                button: event.target.closest('button').className,
                value: value.replace("#", "").toLowerCase()
            }
            event.target.closest('button').classList.toggle('selected');
        }
    });
});