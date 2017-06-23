//need to put this in a module
const server = 'http://localhost:3000';
var obs = [];
var pkSettings = { showAllMarkers: JSON.parse(localStorage.allMarkers) || false }
var pkSessionStorageTimestamp = '';

//init 
$(document).ready(init);
//check or uncheck 'show all box'
document.addEventListener('DOMContentLoaded', checkboxCheck);

function init() {
    const allUrl = server + '/api/all';
    //do we have stored obs?
    if (sessionSet()) {
        //Latest version?
        checkLatestUpdate((updated) => {
            pkSessionStorageTimestamp = updated;
            if (updated === sessionStorage.getItem('pk_updated')) {
                console.log('yeah it is (' + updated + '), working with stored obs.');
                let retrieved = JSON.parse(sessionStorage.getItem('obs'));
                storeObs(retrieved);
            } else {
                console.log('No, changed since');
                console.log('ajax:ing...')
                ajaxRequest('GET', allUrl, storeObs);
            }
        });
    }
}

function sessionSet() {
    console.log('Checking session storage status')
    if (typeof(Storage) !== "undefined" && sessionStorage.getItem('obs')) {
        console.log('Session storage available & obs stored ', sessionStorage.getItem('pk_updated'));
        return true;
    }
    console.log('No obs stored, this fucks everything up');
    return false

}

function checkLatestUpdate(callback) {
    console.log('checking if it is the latest version...')
    let checkUrl = server + '/api/lastupdated';
    ajaxRequest('GET', checkUrl, (res) => {
        callback(res.timestamp);
    })
}

/**
 * general ajax-function
 * @param {string} method 
 * @param {string} url 
 * @param {function} callback 
 */
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
 * Prepares & stores observations in memory
 * (re)Saves them in session storage if updated
 * @param {array} observations 
 * @param {bool} setitem - should we save this in session storage? 
 */
function storeObs(observations) {
    obs = observations;
    for (let i in obs) {
        obs[i].obsDate = new Date(observations[i].obsDate);
        obs[i].coords.lat = parseFloat(observations[i].coords.lat);
        obs[i].coords.lng = parseFloat(observations[i].coords.lng);
    }
    if (typeof(Storage) !== "undefined") {
        //session storage avaiable
        if (sessionStorage.getItem('obs') == null || sessionStorage.getItem('pk_updated') !== pkSessionStorageTimestamp) {
            //pk session not stored or needs to update 
            sessionStorage.setItem('obs', JSON.stringify(obs));
            sessionStorage.setItem('pk_updated', pkSessionStorageTimestamp);
            console.log('Saved obs ' + sessionStorage.getItem('pk_updated') + ' in session storage.')
        }
    }
    createMarkers(); //...now we have the coords -> do markers
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