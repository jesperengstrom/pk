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
            prepareObs(response);
        },
        error: (err) => {
            console.log('Error!', err.statusText);
        }
    })
}


function timelineClick() {
    let places = document.querySelectorAll('.observation-link').forEach((el) => {
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