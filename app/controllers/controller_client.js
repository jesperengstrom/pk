$(document).ready(ready);

function ready() {
    const getAllUrl = 'http://localhost:3000/api/get.html';
    ajaxRequest(getAllUrl);
}

function ajaxRequest(url) {
    $.ajax({
        method: 'GET',
        url: url,
        dataType: 'json',
        success: (response) => {
            printDocs(response, clickMap);
        },
        error: (err) => {
            console.log('Error!', err.statusText);
        }
    })
}

function printDocs(docs, callback) {
    const container = document.querySelector('#list-db');
    let html = `<ul>`;
    for (let i in docs) {
        html += `<li><a href='#' class="place-link" data-lat=${docs[i].coords.lat || "#"} data-long=${docs[i].coords.long || "#"}> ${docs[i].name} </li>`;
    }
    html += `</ul>`;
    container.innerHTML = html;
    callback()
}

function clickMap() {
    let places = document.querySelectorAll('.place-link').forEach((el) => {
        el.addEventListener('click', () => {
            var latlong = {
                lat: parseFloat(el.getAttribute('data-lat')),
                lng: parseFloat(el.getAttribute('data-long'))
            };
            console.log(latlong);
            newMarker(latlong);
        })
    })
}