document.addEventListener('DOMContentLoaded', allmarkersCheckbox); //check or uncheck 'show all box'

//renders about-text on nav-click
document.getElementById('about-btn').addEventListener('click', (e) => {
    e.preventDefault();
    window.history.pushState(null, "", "/about")
    checkUrlParams();
})

/**
 * To prevent drawing timeline bf obs are ready...
 */
function checkLoadStatus() {
    if (pkStatus.timelineLoaded && pkStatus.obsFetched) {
        console.log('status check succeeded at: ' + arguments.callee.caller.name);
        return true;
    } else {
        console.log('status check failed at ' + arguments.callee.caller.name + '. Timeline loaded: ' + pkStatus.timelineLoaded, ' Obs fetched: ' + pkStatus.obsFetched);
        return false;
    }
}

/**
 * is called when timeline is ready
 * displays marker + full observation on click
 */
function timelineClick() {
    let places = document.querySelectorAll('.observation-link').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault(); //so we don't refresh the page
            let id = el.getAttribute('data-id');
            hideContextMarker('witnessLocation');
            hideContextMarker('opLocation')
            window.history.pushState(null, "", "/observation?id=" + id); //changes the URL to include id query string to full post
            checkUrlParams(); //then run the function that check what we should load into our full post-section
        })
    })
}

/**
 * Runs on DOM-load / timeline/marker click / 'about'-click. 
 * Checks url params to get the right content.
 * Needs to make sure everything is loaded to highlight elements properly
 */
function checkUrlParams() {
    if (pkStatus.timelineReady && pkStatus.markersPlaced) {
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('id')) { //if we have an 'id' param...
            let id = urlParams.get('id');
            pkStatus.activeId = id;
            highlightTimeline(id);
            showObsMarker(id);
            ajaxRequest('GET', server + '/api/search?id=' + id, 'json', displayFullObs, displayError); //...we want to fetch that item and render it
        }
        if (urlParams.toString().length === 0 || window.location.pathname === "/about" || window.location.pathname === "/filter") { //index or /about - render about
            ajaxRequest('GET', server + '/api/about', 'html', displayAbout, displayError);
            pkStatus.activeId = false;
        }
        //else.. we might have a search or filter param
    }
}

function highlightTimeline(id) {
    document.querySelectorAll('.observation-link').forEach((el) => {
        el.parentElement.parentElement.classList.remove('highlight-timeline');
        if (el.getAttribute('data-id') === id) {
            el.parentElement.parentElement.classList.add('highlight-timeline');
        };
    });
}

/**
 * Monitors checkbox 'display all markers' true/false
 */
function allmarkersCheckbox() {
    const markerBox = document.querySelector('#all-markers');
    if (pkSettings.showAllMarkers) { //gets stored setting from localstorage
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
        toggleObsMarkers();
    }
}

/**
 * Renders the full db-object
 * @param {object} res - ajax response
 */
function displayFullObs(res) {
    document.title = 'Palmekartan - ' + res.title;

    //the props object tell us if we should create event listeners for these objects
    fullObsProps = {
        witnessCoords: false,
        opCoords: false
    };

    //Defined? --> parse date/fallback
    let obsDatetime = new Date(res.obsDate);
    let obsContent = document.querySelector('#obs-content');

    obsContent.innerHTML =
        `<h2>${res.title}</h2>
        ${renderTags()}
        <table class="table mt-4" id="fullpost-table">
            <tbody>
                ${renderTr('Plats', res.obsLocation.adress)}
                <tr>
                    <th scope="row">Tidpunkt:</td>
                    <td>${dateFormat(obsDatetime, 'isoDate')} kl ${dateFormat(obsDatetime, 'isoTimeShort')}</td>
                </tr>
                ${renderWitness('Vittnet', res.witness)}
                ${renderTr('Observation',res.observation.summary)}
                ${renderTr('Signalement', res.observation.description)}
                <tr>
                    <th scope="row">Kontaktade polisen:</th>
                    <td>${typeof res.policeContacts.calledIn == 'string' ? dateFormat(new Date(res.policeContacts.calledIn), 'isoDate') : '-'}</td>
                </tr>
                ${renderTr('Antal kända förhör', res.policeContacts.numInterrogations)}
                ${renderProtocolArray()}
                ${renderTr('Polisens uppföljning', res.policeContacts.followUp)}
                ${renderOpLocation()}
                ${renderTr('Övrigt', res.other)}
                ${renderSourceArray()}
            </tbody>
        </table>
        ${renderFootnote()}`;

    //scroll to top of obs wrapper
    obsContent.parentElement.scrollTop = 0;

    //footnote
    function renderFootnote() {
        let footer = `<small>Skapad av 
        ${res.created.user} ${dateFormat(new Date(res.created.date), 'isoDateTwo')} 
        kl ${dateFormat(res.created.date, 'isoTimeShortTwo')}</small>`;
        if (res.updated.user) {
            footer += `<br><small>Senast uppdaterad av ${res.updated.user} ${dateFormat(new Date(res.updated.date), 'isoDateTwo')} kl ${dateFormat(new Date(res.updated.date), 'isoTimeShortTwo')}</small>`;
        }
        return footer;
    }

    //plain table row
    function renderTr(key, value) {
        if (value) {
            return `<tr><th scope="row">` + key + `:</th><td class="keep-whitespace">${value}</td></tr>`;
        }
        return ``;
    }

    //interrogation protocol ul list
    function renderProtocolArray() {
        let result = ``;
        if (res.policeContacts.protocols.length > 0) {
            result += `<tr><th scope="row">Förhör:</th><td><ul class="fa-ul">`;
            res.policeContacts.protocols.forEach((el) => {
                if (el.url) {
                    result += `<li><i class="fa-li fa fa-check-square"></i><a href="${el.url}" target="_blank">${dateFormat(new Date(el.date), 'isoDate')}</a></li>`;
                } else result += `<li><i class="fa-li fa fa-check-square"></i>${dateFormat(new Date(el.date), 'isoDate')}</li>`;

            })
            result += `</ul></td></tr>`;
            return result;
        }
        return result;
    }
    //refactor 2 combine this & above?
    function renderSourceArray() {
        let result = ``;
        if (res.sources.length > 0) {
            result += `<tr><th scope="row">Källor:</th><td><ul class="fa-ul">`;
            res.sources.forEach((el) => {
                if (el.url) {
                    result += `<li><i class="fa-li fa fa-check-square"></i><a href="${el.url}" target="_blank">${el.name}</a></li>`;
                } else result += `<li><i class="fa-li fa fa-check-square"></i> ${el.name}`;
            })
            result += `</ul></td></tr>`;
            return result;
        }
        return result;
    }

    //tags
    function renderTags() {
        let result = `<p>`;
        res.tags.forEach((el) => {
            return result += `<span class="badge badge-default mt-3 mr-1"><a class="white-link" href="/filter?tag=${el}">${el}</a></span>`;
        })
        result += `</p>`;
        return result;
    }

    //witness checkbox + button
    function renderWitness() {
        let result = `<tr>
                    <th scope="row">Vittne:</th>
                    <td><p data-query="witness.name=${res.witness.name}">${res.witness.name}</p>`;
        if (res.witness.coords.lat) {
            fullObsProps.witnessCoords = true;
            result += `<div id="witness-container">
                            <div class="form-check mt-2">
                                <label class="form-check-label">
                                    <input id="witness-coords-checkbox" class="form-check-input context-marker" data-target="witnessLocation" type="checkbox" data-lat="${res.witness.coords.lat}" data-lng=${res.witness.coords.lng}> Visa vittnets placering på kartan
                                </label>
                            </div>
                            <button class="btn btn-sm btn-secondary mt-3" id="witness-streetview" data-witnesslat="${res.witness.coords.lat}" data-witnesslng=${res.witness.coords.lng} data-obslat="${res.obsLocation.coords.lat}" data-obslng=${res.obsLocation.coords.lng}>Visa i Street View</button>
                        </div>`;
        }
        result += `</td></tr>`;
        return result;
    }

    //op location checkbox
    function renderOpLocation() {
        let result = ``;
        if (res.opLocation.coords.lat) {
            fullObsProps.opCoords = true;
            result += `<tr>
                        <th scope="row">Olof Palme:</th>
                        <td>
                            <div class="form-check mt-2">
                                <label class="form-check-label">
                                    <input id="op-coords-checkbox" class="form-check-input context-marker" type="checkbox" data-target="opLocation" data-lat="${res.opLocation.coords.lat}" data-lng=${res.opLocation.coords.lng}> Visa Olof Palmes placering vid tidpunkten
                                </label>
                            </div>
                        </td>
                        </tr>`;
        }
        return result;
    }

    //add event listeners for checboxes & buttons in fullpost section
    if (fullObsProps.witnessCoords || fullObsProps.opCoords) {
        document.querySelectorAll('.context-marker').forEach((element) => {
            addEventListener('click', (el) => {
                let target = el.target.getAttribute('data-target');
                if (el.target.checked) showContextMarker(el.target, target);
                else hideContextMarker(target)
            })
        }, this);

        document.getElementById('witness-streetview').addEventListener('click', (el) => {
            showStreetView(el.target)
        })
    }
}


function displayError() {
    let obsContent = document.querySelector('#obs-content');
    obsContent.innerHTML = `<p>Sorry, hittade inte innehållet!<p/>`;
}

function displayAbout(res) {
    let aboutContent = document.querySelector('#obs-content');
    aboutContent.innerHTML = res;
}


/**
 * if URL has filter, filter all obs with selection = obs
 */
function filterObs() {
    var urlParams = new URLSearchParams(window.location.search);
    // if (urlParams.has('tag')) {
    if (window.location.pathname === "/filter") {
        pkStatus.activeFilter = true;
        pkStatus.filter = urlParams.get('tag');
        obs = allObs.filter((e) => { //if we have a tag param, filter allObs
            let result = false
            e.tags.forEach((el) => {
                if (el === pkStatus.filter) {
                    result = true
                }
                return result;
            })
            return result;
        })
        console.log('Filter! Found ' + obs.length + ' observations containing ' + pkStatus.filter);
    } else obs = allObs //if we don't have a filter, go with allObs as obs
}