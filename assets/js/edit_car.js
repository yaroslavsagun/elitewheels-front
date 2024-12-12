import { api_link, img_link } from "./constants.js";

let id = null;

function getId() {
    const data = window.location.search;
    const urlParams = new URLSearchParams(data);
    id = urlParams.get('id');
}

var car = [];

const formData = new FormData();

async function getCar() {
    const res = await fetch(api_link + '/cars?' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const data = await res.json();
    if (data.data[0] == undefined) {
        alert('There is no such car');
        location.href = '/';
    } else {
        car = data.data[0];
    }
}

async function updateCar(id, data) {
    const res = await fetch(api_link + '/cars?' + id + '_method=PUT', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    });
    updateImage(id);
}

async function updateImage(id) {
    const res = await fetch(api_link + '/cars?' + id + '_method=PUT', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            'Accept': 'application/json'
        },
        body: formData
    });
}

async function addCar(data) {
    const res = await fetch(api_link + '/cars', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const result = await res.json();
    updateImage(result.data.id);
}

function gatherData() {
    
}

document.addEventListener('DOMContentLoaded', async function () {
    getId();
    if (id != null) {
        await getCar();
        createCarInfo(car);
    }

    const add_btn = document.querySelector('.submit-btn');
    if (add_btn) {
        add_btn.addEventListener('click', function () {
            let data = gatherData()
            if (id != null) {
                updateCar(data);
            } else {
                addCar(data);
            }
        })
    }

    const imageInput = document.getElementById('left-section');

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
                        <img src="${path}" alt="Car Image">
                    </label>
                    <input type="file" id="mainPhoto" accept="image/*" style="display: none;">`;
            };
        })
    }

    // Додаємо обробку кліків по кольорах
    const colorButtons = document.querySelectorAll('.color-options button');
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Якщо кнопка вже вибрана - знімаємо вибір
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
            } else {
                // Додаємо клас selected для поточної кнопки
                this.classList.add('selected');
            }
        });
    });
});

function isPriceValid() {

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