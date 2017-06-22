//need to put this in a module
const server = 'http://localhost:3000';
var obs = [];
var pkSettings = {
    showAllMarkers: JSON.parse(localStorage.allMarkers) || false
}


//gets all the observations first thing -> storing them
$(document).ready(() => {
    const allUrl = server + '/api/all';
    if (typeof(Storage) !== "undefined" && sessionStorage.getItem('obs')) { // Session storage is available && set
        console.log('Getting object from session storage')
        let retrieved = JSON.parse(sessionStorage.getItem('obs'));
        storeObs(retrieved);
    } else { // No storage support / not set
        console.log('Ajax:ing object from database...');
        ajaxRequest('GET', allUrl, storeObs);
    }
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
        obs[i].obsDate = new Date(observations[i].obsDate);
        obs[i].coords.lat = parseFloat(observations[i].coords.lat);
        obs[i].coords.lng = parseFloat(observations[i].coords.lng);
    }
    if (typeof(Storage) !== "undefined" && sessionStorage.getItem('obs') == null) { //session storage available but not set
        console.log('storing object in session storage...')
        sessionStorage.setItem('obs', JSON.stringify(obs));
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
            showMarker(id);
            ajaxRequest('GET', server + '/api/search/' + id, displayFullObs);
        })
    })
}

/**
 * Displays db-objects outside of timeline & map
 * @param {object} res - ajax response
 */
function displayFullObs(res) {
    let obs = res[0];
    let datetime = new Date(obs.obsDate);
    let created = new Date(obs.created);

    let obsContent = document.querySelector('#obs-content');
    obsContent.innerHTML =
        `<h2>${obs.name}</h2>
        <p><span class="lead">Datum: </span>${datetime}</p>
        <p><span class="lead">Skapad: </span>${created}</p>
        `
}