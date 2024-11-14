document.addEventListener('DOMContentLoaded', function () {
    
    const type_buttons = document.querySelectorAll(".type-options button");
    let type_array = [];

    for (var i = 0; i < type_buttons.length; i++) {
        type_buttons[i].addEventListener('click', function(){
            if (type_array.includes(this.textContent.toLowerCase())) {
                let index = type_array.indexOf(this.textContent.toLowerCase());
                type_array.splice(index, 1);
            } else {
                type_array.push(this.textContent.toLowerCase());
            }
            this.classList.toggle("active");
        })
    }
    
    const color_buttons = document.querySelectorAll(".color-options button");
    let = color_array = [];

    for (var i = 0; i < color_buttons.length; i++) {
        color_buttons[i].addEventListener('click', function(){
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

    searchBtn.addEventListener('click', function() {

        let brand = brand_select.options[brand_select.selectedIndex].text.toLowerCase();
        let price = [maxPrice.value, minPrice.value];
        console.log(brand);
        console.log(color_array);
        console.log(type_array);
        console.log(price);

        console.log(getCars(brand,type_array,price,color_array));
    });
});

async function getCars(brand, type_array, price, color) {
    const res = await fetch(`/api/products?brand=${brand}&options=${type_array.join(",")}&price=${price.join(",")}&color=${color_array.join(",")}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const access = await res.json();
    return access;
}


function getColor(color) {
    color = color.replace("rgb(", "").replace(")", "")
    color = color.replaceAll(" ", "");
    let color_array = color.split(",");
    result = "#";
    for (let i = 0; i < 3; i++) {
        result += componentToHex(parseInt(color_array[i]));
    }
    return result;
}

let componentToHex = (val) => {
    const a = val.toString(16);
    return a.length === 1 ? "0" + a : a;
};