import api_link from "./constants.js";

let manufacturers = []; 

async function initializeManufacturers() {
    const res = await fetch(api_link + `/brands`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const data = await res.json();
    manufacturers = data.data;
    renderManufacturersList(manufacturers);
}

function renderManufacturersList(manufacturers) {
    const container = document.querySelector('.manufacturers-list');
    container.innerHTML = manufacturers.map(manufacturer => `
        <div class="manufacturer-item">
            <input type="checkbox" id="manufacturer-${manufacturer.id}" value="${manufacturer.id}">
            <label for="manufacturer-${manufacturer.id}">${manufacturer.name}</label>
            <span class="manufacturer-count">(${manufacturer.count || 0})</span>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', function () {
    initializeManufacturers();

    const searchInput = document.getElementById('manufacturer-search');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = manufacturers.filter(m => 
            m.name.toLowerCase().includes(searchTerm)
        );
        renderManufacturersList(filtered);
    });

    const type_buttons = document.querySelectorAll(".type-options button");
    let type_array = [];

    for (var i = 0; i < type_buttons.length; i++) {
        type_buttons[i].addEventListener('click', function () {
            if (type_array.includes(this.textContent)) {
                let index = type_array.indexOf(this.textContent);
                type_array.splice(index, 1);
            } else {
                type_array.push(this.textContent);
            }
            this.classList.toggle("active");
        })
    }

    const color_buttons = document.querySelectorAll(".color-options button");
    let color_array = [];

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



    const searchBtn = document.getElementById("search-btn");
    const brand_select = document.getElementById("brand-select");

    searchBtn.addEventListener('click', async function () {
        const selectedManufacturers = Array.from(document.querySelectorAll('.manufacturer-item input:checked'))
            .map(checkbox => checkbox.value);

        let brand = brand_select.options[brand_select.selectedIndex].text;
        let brand_id = (brand != "Any" ? await getBrandId(brand) : null);

        let type_ids = (type_array != [] ? await getTypeIds(type_array) : null);

        let price = [maxPrice.value, minPrice.value];

        console.log(await getCars(brand_id, type_ids, price, color_array));
    });
});

async function getCars(brand, type_ids, price, color_array) {
    let query = "/cars/?";
    if (brand != null) {
        query += `brand_ids[]=${brand}&`;
    }
    if (type_ids != null && type_ids.length != 0) {
        query += `type_ids[]=${type_ids.join("&type_ids[]=")}&`;
    }
    if (color_array.length != 0) {
        query += `colors[]=${color_array.join("&colors[]=")}&`;
    }
    query += `max_price=${price[0]}&min_price=${price[1]}`;

    const res = await fetch(api_link + query, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    const access = await res.json();
    return access.data;
}

async function getBrandId(brand) {
    const res = await fetch(api_link + `/brands`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    const access = await res.json();
    
    for (let i = 0; i < access.data.length; i++) {
        if (access.data[i].name == brand) {
            return access.data[i].id;
        }
    }
}

async function getTypeIds(type_array) {
    const res = await fetch(api_link + `/types`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    const access = await res.json();

    let ids = [];
    for (let i = 0; i < type_array.length; i++) {
        for (let j = 0; j < access.data.length; j++) {
            if (access.data[j].name == type_array[i]) {
                ids.push(access.data[j].id);
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