import { api_link, img_link } from "./constants.js";

let cars = [];

let shown_cars_amount = 8;

async function getCars() {
    const res = await fetch(api_link + `/my-cars`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    });
    const data = await res.json();
    if (data.data == undefined) {
        cars = [];
    } else {
        cars = data.data;
    }
}

async function deleteCar(id) {
    const res = await fetch(api_link + `/cars/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    });
    const result = res.json();
    return result.success;
}

const add_car = document.querySelector('.add-car-btn');

function createCarsList(cars) {
    const car_list = document.querySelector(".car-list");
    let is_there_more = cars.length > 8;

    let shown_cars = cars.slice(0, shown_cars_amount);

    let content = shown_cars.map(car => 
        `<div class="car-item" id="${car.id}">
            <img src="${img_link}${car.main_image.path}" alt="${car.brand.name}  ${car.type.name}" class="car-image">
            <div class="car-info">
                <div class="car-details">
                    <span class="car-brand">${car.brand.name}</span>
                    <span class="car-model">${car.engine} ${car.type.name}</span>
                </div>
                <div class="car-actions">
                    <button class="edit-btn" aria-label="Edit car">
                        <img src="assets/img/edit.png" alt="Edit car">
                    </button>
                    <button class="delete-btn" aria-label="Delete car">
                        <img src="assets/img/delete.png" alt="Delete car">
                    </button>
                </div>
            </div>
        </div>`).join('');
    if (content == '') {
        car_list.innerHTML = '<p class="sorry-label">Sorry, but you don`t have your cars</p>';
    } else {
        car_list.innerHTML = content;

        if (is_there_more) {
            car_list.innerHTML += `<button class="more-btn">More</button>`;
        }

        car_list.addEventListener('click', function (event) {
            let id = event.target.closest('.car-item').id
            console.log(id);
            if (event.target.closest('.edit-btn')) {
                location.href = `/car-edit?id=${id}`
            } else if (event.target.closest('.delete-btn')) {
                let result = deleteCar(id);
                if (result) {
                    let deleted = cars.filter(car => car.id === id);
                    cars.splice(cars.indexOf(deleted),1);
                    createCarsList(cars);
                }
                location.href = `/car-edit`
            } else if (event.target.closest('.car-item')) {
                location.href = `/item?id=${id}`;
            }
        })
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    await getCars();
    createCarsList(cars);

    if (add_car) {
        add_car.addEventListener('click', function () {
            location.href = '/car-edit?action=create';
        })
    }
});