import { api_link, img_link, basic_manufacturers, basic_types } from "./constants.js";

function getId() {
    const data = window.location.search;
    const urlParams = new URLSearchParams(data);
    const id = urlParams.get('id');
    return id;
}

var car = [];

async function getCar() {
    const res = await fetch(api_link + '/cars/?' + getId(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const data = await res.json();
    return data.data;
}

document.addEventListener('DOMContentLoaded', async function () {

});