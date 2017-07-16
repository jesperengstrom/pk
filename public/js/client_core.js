//Init function + those needed to get obs, regardless of page

//need to put this in a module
const server = 'http://localhost:3000';
var obs = [];
// var pkSettings = { showAllMarkers: JSON.parse(localStorage.allMarkers) || true }
var pkSettings = { showAllMarkers: true }
var dbUpdated = '';

//init 
document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('init!')
        //check when db was updated first thing. Then decide if we use session storage or ajax.
    checkLatestUpdate((updated) => {
        dbUpdated = updated;
        if (dbUpdated === sessionStorage.getItem('pk_updated')) {
            console.log(sessionStorage.getItem('pk_updated') + '  is in session storage, using that');
            let retrieved = JSON.parse(sessionStorage.getItem('obs'));
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
    console.log('ajax requesting to', url)
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
    obs = observations;
    for (let i in obs) {
        obs[i].obsDate = new Date(observations[i].obsDate);
        obs[i].obsLocation.coords.lat = parseFloat(observations[i].obsLocation.coords.lat);
        obs[i].obsLocation.coords.lng = parseFloat(observations[i].obsLocation.coords.lng);
    }
    if (typeof(Storage) !== "undefined") { //session storage available
        if (sessionStorage.getItem('obs') == null || sessionStorage.getItem('pk_updated') !== dbUpdated) {
            //pk session not stored or needs to update 
            sessionStorage.setItem('obs', JSON.stringify(obs));
            sessionStorage.setItem('pk_updated', dbUpdated);
            console.log('Saved in session storage.')
        }
    }
    //calling page-specfic functions undefined on other pages
    if (typeof createObsMarkers !== 'undefined') {
        createObsMarkers(); //...now we have the coords -> do markers
    }
    if (typeof renderlist !== 'undefined') {
        renderlist(); //.. or render edit obs list
    }
}