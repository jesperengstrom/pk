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
    //changes the URL to include id - to enable linking 
    window.history.pushState(null, "", "/observation?id=" + res._id); //need to handle GET requests to this adress

    //Defined? --> parse date/fallback
    let obsDatetime = new Date(res.obsDate);
    let obsContent = document.querySelector('#obs-content');

    obsContent.innerHTML =
        `<h2>${res.title}</h2>
        <table class="table mt-4" id="fullpost-table">
            <tbody>
                ${renderTr('Plats', res.obsLocation.adress)}
                <tr>
                    <th scope="row">Tidpunkt:</td>
                    <td>${dateFormat(obsDatetime, 'isoDate')} kl ${dateFormat(obsDatetime, 'isoTimeShort')}</td>
                </tr>
                <tr>
                    <th scope="row">Vittne:</th>
                    <td><a href="/search?witness=${res.witness.name}" data-query="witness.name=${res.witness.name}">${res.witness.name}</a></td>
                </tr>
                ${renderTr('Observation',res.observation.summary)}
                ${renderTr('Signalement', res.observation.description)}
                <tr>
                    <th scope="row">Kontaktade polisen:</th>
                    <td>${typeof res.policeContacts.calledIn == 'string' ? dateFormat(new Date(res.policeContacts.calledIn), 'isoDate') : '-'}</td>
                </tr>
                ${renderTr('Antal kända förhör', res.policeContacts.numInterrogations)}
                ${renderProtocolArray()}
                ${renderTr('Polisens uppföljning mm', res.policeContacts.followUp)}
                ${renderTr('Övrigt', res.other)}
                ${renderTags()}
                ${renderSourceArray()}
            </tbody>
        </table>
        ${renderFootnote()}`;

    //footnote
    function renderFootnote() {
        let footer = `<small>Skapad av 
        ${res.created.user} ${dateFormat(new Date(res.created.date), 'isoDate')} 
        kl ${dateFormat(res.created.date, 'isoTimeShort')}</small>`;
        if (res.updated.user) {
            footer += `<br><small>Senast uppdaterad av ${res.updated.user} ${dateFormat(new Date(res.updated.date), 'isoDate')} kl ${dateFormat(new Date(res.updated.date), 'isoTimeShort')}</small>`;
        }
        return footer;
    }

    function renderTr(key, value) {
        return `<tr><th scope="row">` + key + `:</th><td>${value || '-'}</td></tr>`;
    }

    function renderProtocolArray() {
        let result = ``;
        if (res.policeContacts.protocols.length > 0) {
            result += `<th scope="row">Förhörsprotokoll:</th><td><ul>`;
            res.policeContacts.protocols.forEach((el) => {
                result += `<li><a href="${el.url}" target="_blank">${dateFormat(new Date(el.date), 'isoDate')}</a></li>`;
            })
            result += `</ul></td>`;
            return result;
        }
        return result;
    }
    //refactor 2 combine this & above?
    function renderSourceArray() {
        let result = ``;
        if (res.sources.length > 0) {
            result += `<th scope="row">Källor:</th><td><ul>`;
            res.sources.forEach((el) => {
                if (el.url) {
                    result += `<li><a href="${el.url}" target="_blank">${el.name}</a></li>`;
                } else result += `<li>${el.name}`;
            })
            result += `</ul></td>`;
            return result;
        }
        return result;
    }

    function renderTags() {
        let result = `<th scope="row">Taggar:</th><td>`;
        res.tags.forEach((el) => {
            return result += `<span class="badge badge-default"><a class="white-link" href="/search?tags=${el}" target="_blank">${el}</a></span> `
        })
        result += `</td>`
        return result;
    }
}