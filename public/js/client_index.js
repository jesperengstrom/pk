//check or uncheck 'show all box'
document.addEventListener('DOMContentLoaded', checkboxCheck);

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