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
 * Renders the full db-object
 * @param {object} res - ajax response
 */
function displayFullObs(res) {

    //Defined? --> parse date/fallback
    let obsDatetime = new Date(res.obsDate);

    let obsContent = document.querySelector('#obs-content');
    obsContent.innerHTML =
        `<h2>${res.title}</h2>
        <table class="table mt-4" id="fullpost-table">
            <tbody>
                <tr>
                    <th scope="row">Plats:</th>
                    <td>${res.obsLocation.adress}</td>
                </tr>
                <tr>
                    <th scope="row">Tidpunkt:</td>
                    <td>${dateFormat(obsDatetime, 'isoDate')} kl ${dateFormat(obsDatetime, 'isoTimeShort')}</td>
                </tr>
                <tr>
                    <th scope="row">Vittne:</th>
                    <td><a href="#" data-query="witness.name=${res.witness.name}">${res.witness.name}</a></td>
                </tr>
                <tr>
                    <th scope="row">Observation:</th>
                    <td>${res.observation.summary}</td>
                </tr>
                <tr>
                    <th scope="row">Signalement:</th>
                    <td>${res.observation.description}</td>
                </tr>
                <tr>
                    <th scope="row">Kontaktade polisen:</th>
                    <td>${typeof res.policeContacts.calledIn == 'string' ? dateFormat(new Date(res.policeContacts.calledIn), 'isoDate') : '-'}</td>
                </tr>
                <tr>
                    <th scope="row">Antal kända förhör:</th>
                    <td>${res.policeContacts.numInterrogations || '-'}</td>
                </tr>
                <tr> 
                    <th scope="row">Polisens uppföljning mm:</th>
                    <td>${res.policeContacts.followUp || '-'}</td>
                </tr>
            </tbody>
        </table>`;

    //footnote
    obsContent.innerHTML += `<small>Skapad av ${res.created.user} ${dateFormat(new Date(res.created.date), 'isoDate')} kl ${dateFormat(res.created.date, 'isoTimeShort')}</small>`;

    if (res.updated.user) {
        obsContent.innerHTML += `<br><small>Senast uppdaterad av ${res.updated.user} ${dateFormat(new Date(res.updated.date), 'isoDate')} kl ${dateFormat(new Date(res.updated.date), 'isoTimeShort')}</small>`;
    }
}