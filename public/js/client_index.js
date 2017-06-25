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
            ajaxRequest('GET', server + '/api/search?id=' + id, displayFullObs);
        })
    })
}

/**
 * Displays db-objects outside of timeline & map
 * @param {object} res - ajax response
 */
function displayFullObs(res) {
    let datetime = new Date(res.obsDate);
    let created = new Date(res.created.date);

    let obsContent = document.querySelector('#obs-content');
    obsContent.innerHTML =
        `<h2>${res.name}</h2>
        <p><span class="lead">Observationen skedde: </span>${dateFormat(datetime, 'isoDate')} kl ${dateFormat(datetime, 'isoTimeShort')}</p>
        <p><span class="lead">Adress: </span>${res.adress}</p>
        <small>Skapad av ${res.created.user} ${dateFormat(created, 'isoDate')} kl ${dateFormat(created, 'isoTimeShort')}</small>
        
        `
    if (res.updated.user) {
        obsContent.innerHTML += `<small>Senast uppdaterad av ${res.updated.user} ${dateFormat(new Date(res.updated.date), 'isoDate')} kl ${dateFormat(new Date(res.updated.date), 'isoTimeShort')}</small>
        `;
    }
}