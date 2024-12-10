import { api_link, img_link, basic_manufacturers, basic_types } from "./constants.js";

let manufacturers = [];
let types = [];
let cars = [];

let choosed_types = [];

let shown_cars = 8;

let query = "/cars/?";

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
        manufacturers = basic_manufacturers;
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
        types = basic_types;
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
    container.innerHTML = `
        <div class="manufacturer-item">
            <input type="checkbox" id="manufacturer-A" value="All" checked>
            <label for="manufacturer-A">All</label>
        </div>`

    container.innerHTML += manufacturers.map(manufacturer => `
        <div class="manufacturer-item">
            <input type="checkbox" id="manufacturer-${manufacturer.id}" value="${manufacturer.name}" checked>
            <label for="manufacturer-${manufacturer.id}">${manufacturer.name}</label>
        </div>
    `).join('');

    const allTypes = document.querySelector('.manufacturer-item input#manufacturer-A');
    const types = document.querySelectorAll('.manufacturer-item input');

    allTypes.addEventListener('change', function () {
        if (allTypes.checked) {
            for (let i = 0; i < types.length; i++) {
                types[i].checked = true;
            }
        }
    })

    for (let i = 0; i < types.length; i++) {
        types[i].addEventListener('change', function () {
            if (!types[i].checked) {
                allTypes.checked = false;
            } else if (document.querySelectorAll('.manufacturer-item input:checked').length
                == document.querySelectorAll('.manufacturer-item').length - 1) {
                allTypes.checked = true;
            }
        })
    }
}

function createTypesList(types) {
    const container = document.querySelector('.type-options');
    container.innerHTML = types.map(type => `<button>${type.name}</button>`).join('');

    const type_buttons = document.querySelectorAll(".type-options button");
    for (var i = 0; i < type_buttons.length; i++) {
        type_buttons[i].addEventListener('click', function () {
            if (choosed_types.includes(this.textContent)) {
                let index = choosed_types.indexOf(this.textContent);
                choosed_types.splice(index, 1);
            } else {
                choosed_types.push(this.textContent);
            }
            this.classList.toggle("active");
        })
    }
}

function createCarsList(cars) {
    const car_list = document.querySelector(".catalog-content");

    let is_there_more = cars.length > 8;

    cars = cars.slice(0, shown_cars);
    let content = cars.map(car => `
        <div class="car-card" id="${car.id}">
                    <img src="${img_link}${car.main_image.path}" alt="${car.brand.name} ${car.type.name}">
                    <div class="car-info" >
                        <h3>${car.brand.name}</h3>
                        <p>${car.engine} ${car.type.name}</p>
                        <span class="price">${car.price}$/day</span>
                    </div>
                </div>`).join('');
                console.log(car_list.innerHTML);
    if (content == '') {
        car_list.innerHTML = '<p class="sorry-label">Sorry, but there are no cars with such filters</p>';
    } else {
        car_list.innerHTML = `<main class="cars-grid">
            ${content}
        </main>`

        if (is_there_more) {
            car_list.innerHTML += `<button class="more-btn">More</button>`;
        }

        const car_elements = document.querySelectorAll('.cars-grid .car-card');
        console.log(car_elements);
        for (let i = 0; i < car_elements.length; i++) {
            car_elements[i].addEventListener('click', function () {
                location.href = `/item?id=${car_elements[i].id}`;
            });
        }
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

    const moreBtn = document.querySelector('.more-btn');
    moreBtn.addEventListener('click', async function () {
        shown_cars += 4;
        createCarsList(await getCars());
    })

    const searchInput = document.getElementById('manufacturer-search');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = manufacturers.filter(m =>
            m.name.toLowerCase().includes(searchTerm)
        );
        createManufacturersList(filtered);
    });

    const color_buttons = document.querySelectorAll(".color-options button");
    let color_array = ['ffffff', '000000', 'cd0000', '7a7a7a', '9d7800', '493129', '0d0847', '084712'];

    for (var i = 0; i < color_buttons.length; i++) {
        color_buttons[i].addEventListener('click', function () {
            let color = getColor(this.style.backgroundColor);
            if (color_array.includes(color)) {
                let index = color_array.indexOf(color);
                color_array.splice(index, 1);
            } else {
                color_array.push(color);
            }
            this.classList.toggle("active");
        })
    }

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
        const selectedManufacturers = Array.from(document.querySelectorAll('.manufacturer-item input:checked'))
            .map(checkbox => checkbox.value);
        let manufacturer_ids = (selectedManufacturers[0] != 'Any' ? await getManufacturerIds(selectedManufacturers) : null);
        let type_ids = (choosed_types != [] ? await getTypeIds(choosed_types) : null);
        let price = [maxPrice.value, minPrice.value];

        getQuery(manufacturer_ids, type_ids, price, color_array)
        createCarsList(await getCars());
    });
});

function getQuery(manufacturer_ids, type_ids, price, color_array) {
    query = "/cars/?";
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