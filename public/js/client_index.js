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
        <table class="table mt-4">
            <tbody>
                <tr>
                    <th scope="row">Tidpunkt:</td>
                    <td>${dateFormat(datetime, 'isoDate')} kl ${dateFormat(datetime, 'isoTimeShort')}</td>
                </tr>
                <tr>
                    <th scope="row">Plats:</th>
                    <td>${res.obsLocation.adress}</td>
                </tr>
                <tr>
                    <th scope="row">Vittne:</th>
                    <td></td>
                </tr>
            </tbody>
        </table>
        
        <small>Skapad av ${res.created.user} ${dateFormat(created, 'isoDate')} kl ${dateFormat(created, 'isoTimeShort')}</small>
        `
    if (res.updated.user) {
        obsContent.innerHTML += `<br><small>Senast uppdaterad av ${res.updated.user} ${dateFormat(new Date(res.updated.date), 'isoDate')} kl ${dateFormat(new Date(res.updated.date), 'isoTimeShort')}</small>
        `;
    }
}