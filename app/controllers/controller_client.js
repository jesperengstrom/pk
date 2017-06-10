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
        html += `<li>
                    <a href='#' class="place-link" 
                    data-name='${docs[i].name}'
                    data-lat=${docs[i].coords.lat || "#"}
                    data-long=${docs[i].coords.long || "#"}>
                    ${docs[i].name}</li>`;
    }
    html += `</ul>`;
    container.innerHTML = html;
    callback()
}

function clickMap() {
    let places = document.querySelectorAll('.place-link').forEach((el) => {
        el.addEventListener('click', () => {
            let name = el.getAttribute('data-name');
            let latlong = {
                lat: parseFloat(el.getAttribute('data-lat')),
                lng: parseFloat(el.getAttribute('data-long'))
            };
            newMarker(latlong, name);
        })
    })
}