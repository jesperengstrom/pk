//need to put this in a module
const server = 'http://localhost:3000';
var obs = [];
var pkSettings = {
    showAllMarkers: JSON.parse(localStorage.allMarkers) || false
}


//gets all the observations first thing -> storing them
$(document).ready(() => {
    const allUrl = server + '/api/all';
    ajaxRequest('GET', allUrl, storeObs);
    checkboxCheck();

});

function ajaxRequest(method, url, callback) {
    $.ajax({
        method: method,
        url: url,
        dataType: 'json',
        success: (response) => {
            callback(response);
        },
        error: (err) => {
            console.log('Error!', err.statusText);
        }
    })
}

/**
 * Monitors display all markers or not
 */
function checkboxCheck() {
    const markerBox = document.querySelector('#all-markers');
    if (pkSettings.showAllMarkers) {
        markerBox.checked = true;
    }
    if (!pkSettings.showAllMarkers) {
        markerBox.checked = false;
    }

    markerBox.onchange = () => { //listen for changes & change setting / toggle view
        pkSettings.showAllMarkers = markerBox.checked;
        if (typeof(Storage) !== 'undefined') {
            localStorage.setItem('allMarkers', markerBox.checked); //saving this setting in local storage
        }
        toggleMarkers();
    }
}

/**
 * callback function for when observations are ready
 * @param {array} observations 
 */
function storeObs(observations) {
    obs = observations;
    for (let i in obs) {
        obs[i].dateTime = new Date(observations[i].dateTime.date + " " + observations[i].dateTime.time);
        obs[i].coords.lat = parseFloat(observations[i].coords.lat);
        obs[i].coords.lng = parseFloat(observations[i].coords.lng);
    }
    createMarkers(); //...now we also have the coords
}

/**
 * displays marker + full observation on click
 */
function timelineClick() {
    let places = document.querySelectorAll('.observation-link').forEach((el) => {
        el.addEventListener('click', () => {
            let id = el.getAttribute('data-id');
            // let name = el.getAttribute('data-name');
            // let latlong = {
            //     lat: parseFloat(el.getAttribute('data-lat')),
            //     lng: parseFloat(el.getAttribute('data-lng'))
            // };
            showMarker(id);
            ajaxRequest('GET', server + '/api/search/' + id, displayFullObs);
        })
    })
}