'use strict';

//module handeling init function + those needed to get observations on all pages

var core = function () {

    //SERVER
    //dev
    // const server = 'http://localhost:3000';
    //production
    var server = 'http://palmekartan.cloudno.de';

    //all observations array - setter/getter
    var allObs = [];

    function getAllObs() {
        return allObs;
    }

    var obs = [];

    function getObs() {
        return obs;
    }

    function setObs(o) {
        obs = o;
    }

    //SETTINGS obs + setters / getters
    var pkSettings = {
        allMarkers: fetchSettings('allMarkers'),
        showStatic: fetchSettings('showStatic')
    };

    function getPkSettings(setting) {
        return pkSettings[setting];
    }

    function setPkSettings(setting, value) {
        pkSettings[setting] = value;
    }

    /**
     * checks for stored settings, else return defaults
     * @param {string} setting 
     */
    function fetchSettings(setting) {
        if (typeof Storage !== "undefined" && localStorage.getItem(setting) !== null) {
            return JSON.parse(localStorage[setting]);
        }
        return true;
    }

    //STATUS - obj monitoring loading & status of app client + setters / getters
    var pkStatus = {
        dbUpdated: '',
        obsFetched: false, //obs-arr in storage
        timelineLoaded: false, //my_timeline.js loaded
        timelineEvents: false, //obs added as timeline rows
        timelineReady: false, //timeline drawn (can be seleced in DOM)
        markersPlaced: false, //map markers placed (can be selected in DOM)
        activeId: false, //saves current id displayed on page (for marker toggle)
        activeFilter: false
    };

    function getPkStatus(prop) {
        return pkStatus[prop];
    }

    function setPkStatus(prop, value) {
        pkStatus[prop] = value;
    }

    function init() {
        //check when db was updated first thing. Then decide if we use session storage or ajax.
        checkLatestUpdate(function (updated) {
            pkStatus.dbUpdated = updated;
            if (pkStatus.dbUpdated === sessionStorage.getItem('pk_updated') && pkStatus.dbUpdated !== null) {
                console.log(sessionStorage.getItem('pk_updated') + '  is in session storage, using that');
                var retrieved = JSON.parse(sessionStorage.getItem('allObs'));
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
        console.log('checking latest version of pk db...');
        var checkUrl = server + '/api/lastupdated';
        ajaxRequest('GET', checkUrl, 'json', function (res) {
            console.log('was changed ' + res.timestamp);
            callback(res.timestamp);
        });
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
            success: function success(response) {
                successCallback(response);
            },
            error: function error(err) {
                console.log('Error!', err.statusText);
                if (failCallback) {
                    failCallback();
                }
            }
        });
    }

    /**
     * Prepares & stores observations in memory
     * (re)Saves them in session storage if updated
     * @param {array} observations 
     * @param {bool} setitem - should we save this in session storage? 
     */
    function storeObs(observations) {
        allObs = observations;
        for (var i in allObs) {
            allObs[i].obsDate = new Date(observations[i].obsDate);
            allObs[i].obsLocation.coords.lat = parseFloat(observations[i].obsLocation.coords.lat);
            allObs[i].obsLocation.coords.lng = parseFloat(observations[i].obsLocation.coords.lng);
        }
        if (typeof Storage !== "undefined") {
            //session storage available
            if (sessionStorage.getItem('allObs') == null || sessionStorage.getItem('pk_updated') !== pkStatus.dbUpdated) {
                //pk session not stored or needs to update 
                sessionStorage.setItem('allObs', JSON.stringify(allObs));
                sessionStorage.setItem('pk_updated', pkStatus.dbUpdated);
                console.log('Saved in session storage.');
            }
        }

        pkStatus.obsFetched = true; //tell app obs are in storage

        //calling page-specfic functions undefined on other pages
        if (typeof indexMap !== 'undefined') {
            //= index
            index.filterObs(); //now we have the coords -> check if we need to filter..
            indexMap.createObsMarkers(); //... do markers

            if (index.checkLoadStatus() && !pkStatus.timelineEvents) {
                //..if timeline failed due to late ajax, redraw it
                indexTimeline.drawVisualization();
            }
        }
        if (typeof editList !== 'undefined') {
            //= edit list
            setObs(getAllObs());
            editList.renderList(); //.. or render edit obs list
        }
    }

    return {
        init: init,
        server: server,
        getPkSettings: getPkSettings,
        getPkStatus: getPkStatus,
        setPkStatus: setPkStatus,
        setPkSettings: setPkSettings,
        getAllObs: getAllObs,
        getObs: getObs,
        setObs: setObs,
        ajaxRequest: ajaxRequest
    };
}();

(function () {
    //init 
    document.addEventListener('DOMContentLoaded', core.init);
})();