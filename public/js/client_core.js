//Init function + those needed to get obs, regardless of page
//need to put this in a module

//dev
// const server = 'http://localhost:3000';

//production
const server = 'http://palmekartan.cloudno.de';

var allObs = [];
var obs = [];
// var pkSettings = { showAllMarkers: JSON.parse(localStorage.allMarkers) || true }
var pkSettings = { showAllMarkers: true }

//object monitoring loading & status of app client
var pkStatus = {
    dbUpdated: '',
    obsFetched: false, //object of observations in storage
    timelineLoaded: false, //my_timeline.js loaded
    timelineEvents: false, //obs added as timeline rows
    timelineReady: false, //timeline drawn (can be seleced in DOM)
    markersPlaced: false, //map markers placed (can be selected in DOM)
    activeId: false, //saves current id displayed on page (for marker toggle)
    activeFilter: false
}

//init 
document.addEventListener('DOMContentLoaded', init);

function init() {
    //check when db was updated first thing. Then decide if we use session storage or ajax.
    checkLatestUpdate((updated) => {
        pkStatus.dbUpdated = updated;
        if (pkStatus.dbUpdated === sessionStorage.getItem('pk_updated') && pkStatus.dbUpdated !== null) {
            console.log(sessionStorage.getItem('pk_updated') + '  is in session storage, using that');
            let retrieved = JSON.parse(sessionStorage.getItem('allObs'));
            storeObs(retrieved);
        } else {
            console.log('Nah, ' + sessionStorage.getItem('pk_updated') + ' is in storage, ajaxing');
            ajaxRequest('GET', server + '/api/all', 'json', storeObs);
        }
    });
}

/**
 * returns timestamp of latest edit of pk db
 * @param {function} callback 
 */
function checkLatestUpdate(callback) {
    console.log('checking latest version of pk db...')
    let checkUrl = server + '/api/lastupdated';
    ajaxRequest('GET', checkUrl, 'json', (res) => {
        console.log('was changed ' + res.timestamp)
        callback(res.timestamp);
    })
}

/**
 * general ajax-function
 * @param {string} method 
 * @param {string} url 
 * @param {function} callback 
 */
function ajaxRequest(method, url, dataType, successCallback, failCallback) {
    $.ajax({
        method: method,
        url: url,
        dataType: dataType,
        success: (response) => {
            successCallback(response);
        },
        error: (err) => {
            console.log('Error!', err.statusText);
            if (failCallback) {
                failCallback();
            }
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
    allObs = observations;
    for (let i in allObs) {
        allObs[i].obsDate = new Date(observations[i].obsDate);
        allObs[i].obsLocation.coords.lat = parseFloat(observations[i].obsLocation.coords.lat);
        allObs[i].obsLocation.coords.lng = parseFloat(observations[i].obsLocation.coords.lng);
    }
    if (typeof(Storage) !== "undefined") { //session storage available
        if (sessionStorage.getItem('allObs') == null || sessionStorage.getItem('pk_updated') !== pkStatus.dbUpdated) {
            //pk session not stored or needs to update 
            sessionStorage.setItem('allObs', JSON.stringify(allObs));
            sessionStorage.setItem('pk_updated', pkStatus.dbUpdated);
            console.log('Saved in session storage.')
        }
    }

    pkStatus.obsFetched = true; //tell app obs are in storage

    //calling page-specfic functions undefined on other pages
    if (typeof createObsMarkers !== 'undefined') {
        filterObs(); //now we have the coords -> check if we need to filter..
        createObsMarkers(); //... do markers

        if (checkLoadStatus() && !pkStatus.timelineEvents) { //..if timeline failed due to late ajax, redraw it
            drawVisualization();
        }
    }
    if (typeof renderlist !== 'undefined') {
        obs = allObs;
        renderlist(); //.. or render edit obs list
    }
}