import { api_link, img_link } from "./constants.js";

let manufacturers = [];
let types = [];
let cars = [];

let choosed_manufacturers = [];
let choosed_types = [];

let shown_cars_amount = 8;

let query = "/cars?";

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
    choosed_manufacturers = Array.from(manufacturers).map(manufacturer => manufacturer.name);
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

async function getCars() {
    const res = await fetch(api_link + query, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const data = await res.json();
    if (data.data == undefined) {
        cars = [];
    } else {
        cars = data.data;
    }
}


function createManufacturersList(manufacturers) {
    const container = document.querySelector('.manufacturers-list');

    container.innerHTML = manufacturers.map(manufacturer => `
        <div class="manufacturer-item">
            <input type="checkbox" id="manufacturer-${manufacturer.id}" value="${manufacturer.name}" 
            ${choosed_manufacturers.includes(manufacturer.name) ? "checked" : ""}>
            <label for="manufacturer-${manufacturer.id}">${manufacturer.name}</label>
        </div>
    `).join('');

    container.addEventListener('change', function(event) {
        if (event.target.closest('input')) {
            let checkbox = event.target.closest('input');
            if (checkbox.checked) {
                if (!choosed_manufacturers.includes(checkbox.value)) {
                    choosed_manufacturers.push(checkbox.value);
                }
            } else {
                let index = choosed_manufacturers.indexOf(checkbox.value)
                choosed_manufacturers.splice(index, 1);
            }
            console.log(choosed_manufacturers);
        }
    })
}

function createTypesList(types) {
    const container = document.querySelector('.type-options');
    container.innerHTML = types.map(type => `<button>${type.name}</button>`).join('');

    container.addEventListener('click', function(event) {
        if (event.target.closest('button')) {
            let type = event.target.closest('button');
            if (choosed_types.includes(type.textContent)) {
                let index = choosed_types.indexOf(type.textContent);
                choosed_types.splice(index, 1);
            } else {
                choosed_types.push(type.textContent);
            }
            type.classList.toggle("active");
        }
    });
}

function createCarsList(cars) {
    const car_list = document.querySelector(".catalog-content");

    let are_there_more = cars.length > 8;

    let shown_cars = cars.slice(0, shown_cars_amount);
    let content = shown_cars.map(car => `
        <div class="car-card" id="${car.id}">
                    <img src="${car.main_image != null ? img_link+car.main_image.path : "assets/img/blank_car.png"}" alt="${car.brand.name} ${car.type.name}">
                    <div class="car-info" >
                        <h3>${car.brand.name}</h3>
                        <p>${car.engine} ${car.type.name}</p>
                        <span class="price">${car.price}$/day</span>
                    </div>
                </div>`).join('');
    if (content == '') {
        car_list.innerHTML = '<p class="sorry-label">Sorry, but there are no cars with such filters</p>';
    } else {
        car_list.innerHTML = `<main class="cars-grid">
            ${content}
        </main>`

        if (are_there_more) {
            car_list.innerHTML += `<button class="more-btn">More</button>`;
        }

        car_list.addEventListener('click', function(event) {
            if (event.target.closest('.car-card')) {
                let id = event.target.closest('.car-card').id;
                location.href = `/item?id=${id}`;
            } else if (event.target.closest('button')){
                shown_cars_amount += 4;
                createCarsList(cars);
            }
        });
    }
}

async function getParameters() {
    await getManufacturers();
    await getTypes();
    await getCars()
}

function createCatalog() {
    createManufacturersList(manufacturers);
    createTypesList(types);
    createCarsList(cars);
}

document.addEventListener('DOMContentLoaded', async function () {
    await getParameters();
    createCatalog();

    const searchInput = document.getElementById('manufacturer-search');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = manufacturers.filter(m =>
            m.name.toLowerCase().includes(searchTerm)
        );
        createManufacturersList(filtered);
    });

    const color_opt = document.querySelector('.color-options');
    color_opt.addEventListener('click', function(event) {
        if (event.target.closest('button')) {
            let color = getColor(event.target.closest('button').style.backgroundColor);
            if (color_array.includes(color)) {
                let index = color_array.indexOf(color);
                color_array.splice(index, 1);
            } else {
                color_array.push(color);
            }
            event.target.closest('button').classList.toggle('active');
        }
    });
    let color_array = ['ffffff', '000000', 'cd0000', '7a7a7a', '9d7800', '493129', '0d0847', '084712'];


    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const minPriceInput = document.getElementById('minPriceInput');
    const maxPriceInput = document.getElementById('maxPriceInput');

    function updateSliders() {

        if (parseInt(minPrice.value) > parseInt(maxPrice.value)) {
            if (this === minPrice) {
                maxPrice.value = minPrice.value;
            } else {
                minPrice.value = maxPrice.value;
            }
        }
        minPriceInput.value = minPrice.value;
        maxPriceInput.value = maxPrice.value;
    }

    minPrice.addEventListener('input', updateSliders);
    maxPrice.addEventListener('input', updateSliders);

    minPriceInput.addEventListener('change', function () {
        minPrice.value = this.value;
        updateSliders.call(minPrice);
    });

    maxPriceInput.addEventListener('change', function () {
        maxPrice.value = this.value;
        updateSliders.call(maxPrice);
    });

    const searchBtn = document.getElementById("filter-search-btn");

    searchBtn.addEventListener('click', async function () {
        let manufacturer_ids = (choosed_manufacturers.length != manufacturers.length + 1 ?
            await getManufacturerIds(choosed_manufacturers) : null);
        let type_ids = (choosed_types != [] ? await getTypeIds(choosed_types) : null);
        let price = [maxPrice.value, minPrice.value];

        getQuery(manufacturer_ids, type_ids, price, color_array);
        await getCars()
        createCarsList(cars);
    });
});

function getQuery(manufacturer_ids, type_ids, price, color_array) {
    query = "/cars?";
    if (manufacturer_ids != null && manufacturer_ids.length != manufacturers.length) {
        query += `brand_ids[]=${manufacturer_ids.join("&brand_ids[]=")}&`;
    }
    if (type_ids != null && type_ids.length != 0) {
        query += `type_ids[]=${type_ids.join("&type_ids[]=")}&`;
    }
    if (color_array.length != 8) {
        query += `colors[]=${color_array.join("&colors[]=")}&`;
    }
    query += `max_price=${price[0]}&min_price=${price[1]}`;
}

async function getManufacturerIds(choosed_manufacturers) {
    let ids = [];
    for (let i = 0; i < choosed_manufacturers.length; i++) {
        for (let j = 0; j < manufacturers.length; j++) {
            if (manufacturers[j].name == choosed_manufacturers[i]) {
                ids.push(manufacturers[j].id);
                break;
            }
        }
    }
    return ids;
}

async function getTypeIds(choosed_types) {
    let ids = [];
    for (let i = 0; i < choosed_types.length; i++) {
        for (let j = 0; j < types.length; j++) {
            if (types[j].name == choosed_types[i]) {
                ids.push(types[j].id);
                break;
            }
        }
    }
    return ids;
}

function getColor(color) {
    color = color.replace("rgb(", "").replace(")", "")
    color = color.replaceAll(" ", "");
    let color_array = color.split(",");
    let result = "";
    for (let i = 0; i < 3; i++) {
        result += componentToHex(parseInt(color_array[i]));
    }
    return result;
}

let componentToHex = (val) => {
    const a = val.toString(16);
    return a.length === 1 ? "0" + a : a;
};