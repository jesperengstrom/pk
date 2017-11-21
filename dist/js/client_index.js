'use strict';

//module containing functions for main index page

var index = function () {

    /**
     * To prevent drawing timeline bf obs are ready...
     */
    function checkLoadStatus() {
        if (core.getPkStatus('timelineLoaded') && core.getPkStatus('obsFetched')) {
            console.log('status check succeeded');
            return true;
        } else {
            console.log('status check failed. Timeline loaded: ' + core.getPkStatus('timelineLoaded'), ' Obs fetched: ' + core.getPkStatus('obsFetched'));
            return false;
        }
    }

    /**
     * is called when timeline is ready
     * displays marker + full observation on click
     */
    function timelineClick() {
        Array.from(document.querySelectorAll('.observation-link')).forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault(); //so we don't refresh the page
                var id = el.getAttribute('data-id');
                indexMap.hideContextMarker('witnessLocation');
                indexMap.hideContextMarker('opLocation');
                window.history.pushState(null, "", "/observation?id=" + id); //changes the URL to include id query string to full post
                checkUrlParams(); //then run the function that check what we should load into our full post-section
            });
        });
    }

    /**
     * Runs on DOM-load / timeline/marker click / 'about'-click. 
     * Checks url params to get the right content.
     * Needs to make sure everything is loaded to highlight elements properly
     */
    function checkUrlParams() {
        if (core.getPkStatus('timelineReady') && core.getPkStatus('markersPlaced')) {
            var urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('id')) {
                //if we have an 'id' param...
                var id = urlParams.get('id');
                core.setPkStatus('activeId', id);
                highlightTimeline(id);
                indexMap.showObsMarker(id);
                core.ajaxRequest('GET', core.server + '/api/search?id=' + id, 'json', displayFullObs, displayError); //...we want to fetch that item and render it
            }
            if (urlParams.toString().length === 0 || window.location.pathname === "/about" || window.location.pathname === "/filter") {
                //index or /about - render about
                core.ajaxRequest('GET', core.server + '/api/about', 'html', displayAbout, displayError);
                core.setPkStatus('activeId', false);
            }
        }
    }

    function highlightTimeline(id) {
        Array.from(document.querySelectorAll('.observation-link')).forEach(function (el) {
            el.parentElement.parentElement.classList.remove('highlight-timeline');
            if (el.getAttribute('data-id') === id) {
                el.parentElement.parentElement.classList.add('highlight-timeline');
            };
        });
    }

    /**
     * Renders & monitors settings in nav bar
     */
    function monitorMapSettings() {
        var allMarkers = document.getElementById('options-all-markers');
        var oneMarker = document.getElementById('options-one-marker');
        core.getPkSettings('allMarkers') ? allMarkers.checked = true : oneMarker.checked = true;

        [allMarkers, oneMarker].forEach(function (el) {
            el.addEventListener('change', function () {
                setOption(allMarkers, 'allMarkers', indexMap.toggleObsMarkers);
            });
        });
    }

    function monitorTimelineSettings() {
        var showStatic = document.getElementById('options-static-events');
        core.getPkSettings('showStatic') ? showStatic.checked = true : showStatic.checked = false;
        showStatic.addEventListener('change', function () {
            setOption(showStatic, 'showStatic', indexTimeline.toggleStaticEvents);
        });
    }

    function setOption(element, option, callback) {
        element.checked ? core.setPkSettings(option, true) : core.setPkSettings(option, false);
        if (typeof Storage !== 'undefined') {
            localStorage.setItem(option, core.getPkSettings(option));
        }
        callback();
    }

    /**
     * Renders the full db-object
     * @param {object} res - ajax response
     */
    function displayFullObs(res) {
        document.title = 'Palmekartan - ' + res.title;

        //the props object tell us if we should create event listeners for these objects
        var fullObsProps = {
            witnessCoords: false,
            opCoords: false
        };

        //Defined? --> parse date/fallback
        var obsDatetime = new Date(res.obsDate);
        var obsContent = document.querySelector('#obs-content');

        obsContent.innerHTML = '<h2>' + res.title + '</h2>\n        ' + renderTags() + '\n        <table class="table mt-4" id="fullpost-table">\n            <tbody>\n                ' + renderTr('Plats', res.obsLocation.adress) + '\n                <tr>\n                    <th scope="row">Tidpunkt:</td>\n                    <td>' + dateFormat(obsDatetime, 'isoDate') + ' kl ' + dateFormat(obsDatetime, 'isoTimeShort') + '</td>\n                </tr>\n                ' + renderWitness('Vittnet', res.witness) + '\n                ' + renderTr('Observation', res.observation.summary) + '\n                ' + renderTr('Signalement', res.observation.description) + '\n                ' + (typeof res.policeContacts.calledIn == 'string' ? '<tr><th scope="row">Kontaktade polisen:</th><td>' + dateFormat(new Date(res.policeContacts.calledIn), 'isoDate') + '</td></tr>' : '') + '\n                ' + renderTr('Antal kända förhör', res.policeContacts.numInterrogations) + '\n                ' + renderProtocolArray() + '\n                ' + renderTr('Polisens uppföljning', res.policeContacts.followUp) + '\n                ' + renderOpLocation() + '\n                ' + renderTr('Övrigt', res.other) + '\n                ' + renderSourceArray() + '\n            </tbody>\n        </table>\n        <hr>\n        ' + renderFootnote();

        //scroll to top of obs wrapper
        obsContent.parentElement.scrollTop = 0;

        //footnote
        function renderFootnote() {
            var footer = '<small>Skapad av \n        ' + res.created.user + ' ' + dateFormat(new Date(res.created.date), 'isoDateTwo') + ' \n        kl ' + dateFormat(res.created.date, 'isoTimeShortTwo') + '</small>';
            if (res.updated.user) {
                footer += '<br><small>Senast uppdaterad av ' + res.updated.user + ' ' + dateFormat(new Date(res.updated.date), 'isoDateTwo') + ' kl ' + dateFormat(new Date(res.updated.date), 'isoTimeShortTwo') + '</small>';
            }
            return footer;
        }

        //plain table row
        function renderTr(key, value) {
            if (value) {
                return '<tr><th scope="row">' + key + (':</th><td class="keep-whitespace">' + value + '</td></tr>');
            }
            return '';
        }

        //interrogation protocol ul list
        function renderProtocolArray() {
            var result = '';
            if (res.policeContacts.protocols.length > 0) {
                result += '<tr><th scope="row">F\xF6rh\xF6r:</th><td><ul class="fa-ul">';
                res.policeContacts.protocols.forEach(function (el) {
                    if (el.url) {
                        result += '<li><i class="fa-li fa fa-check-square"></i><a href="' + el.url + '" target="_blank">' + dateFormat(new Date(el.date), 'isoDate') + '</a></li>';
                    } else result += '<li><i class="fa-li fa fa-check-square"></i>' + dateFormat(new Date(el.date), 'isoDate') + '</li>';
                });
                result += '</ul></td></tr>';
                return result;
            }
            return result;
        }
        //refactor 2 combine this & above?
        function renderSourceArray() {
            var result = '';
            if (res.sources.length > 0) {
                result += '<tr><th scope="row">K\xE4llor:</th><td><ul class="fa-ul">';
                res.sources.forEach(function (el) {
                    if (el.url) {
                        result += '<li><i class="fa-li fa fa-check-square"></i><a href="' + el.url + '" target="_blank">' + el.name + '</a></li>';
                    } else result += '<li><i class="fa-li fa fa-check-square"></i> ' + el.name;
                });
                result += '</ul></td></tr>';
                return result;
            }
            return result;
        }

        //tags
        function renderTags() {
            if (res.tags) {
                var result = '<p>';
                res.tags.forEach(function (el) {
                    return result += '<span class="badge badge-default mt-3 mr-1"><a class="white-link" href="/filter?tag=' + el + '">' + el + '</a></span>';
                });
                result += '</p>';
                return result;
            }
            return '';
        }

        //witness checkbox + button
        function renderWitness() {
            var result = '<tr>\n                    <th scope="row">Vittne:</th>\n                    <td><p data-query="witness.name=' + res.witness.name + '">' + res.witness.name + '</p>';
            if (res.witness.coords.lat) {
                fullObsProps.witnessCoords = true;
                result += '<div id="witness-container">\n                            <div class="form-check mt-2">\n                                <label class="form-check-label">\n                                    <input id="witness-coords-checkbox" class="form-check-input context-marker" data-target="witnessLocation" type="checkbox" data-lat="' + res.witness.coords.lat + '" data-lng=' + res.witness.coords.lng + '> Visa vittnets placering p\xE5 kartan\n                                </label>\n                            </div>\n                            <button class="btn btn-sm btn-secondary mt-3" id="witness-streetview" data-witnesslat="' + res.witness.coords.lat + '" data-witnesslng=' + res.witness.coords.lng + ' data-obslat="' + res.obsLocation.coords.lat + '" data-obslng=' + res.obsLocation.coords.lng + '>Visa i Street View</button>\n                        </div>';
            }
            result += '</td></tr>';
            return result;
        }

        //op location checkbox
        function renderOpLocation() {
            var result = '';
            if (res.opLocation.coords.lat) {
                fullObsProps.opCoords = true;
                result += '<tr>\n                        <th scope="row">Olof Palme:</th>\n                        <td>\n                            <div class="form-check mt-2">\n                                <label class="form-check-label">\n                                    <input id="op-coords-checkbox" class="form-check-input context-marker" type="checkbox" data-target="opLocation" data-lat="' + res.opLocation.coords.lat + '" data-lng=' + res.opLocation.coords.lng + '> Visa Olof Palmes placering vid tidpunkten\n                                </label>\n                            </div>\n                        </td>\n                        </tr>';
            }
            return result;
        }

        //add event listeners for checboxes & buttons in fullpost section
        if (fullObsProps.witnessCoords || fullObsProps.opCoords) {
            Array.from(document.querySelectorAll('.context-marker')).forEach(function (element) {
                addEventListener('click', function (el) {
                    var target = el.target.getAttribute('data-target');
                    if (el.target.checked) indexMap.showContextMarker(el.target, target);else indexMap.hideContextMarker(target);
                });
            }, this);
            if (fullObsProps.witnessCoords) {
                document.getElementById('witness-streetview').addEventListener('click', function (el) {
                    indexMap.showStreetView(el.target);
                });
            }
        }
    }

    function displayError() {
        var obsContent = document.querySelector('#obs-content');
        obsContent.innerHTML = '<p>Sorry, hittade inte inneh\xE5llet!<p/>';
    }

    function displayAbout(res) {
        var aboutContent = document.querySelector('#obs-content');
        aboutContent.innerHTML = res;
    }

    /**
     * if URL has filter, obs = allObs === filter
     */
    function filterObs() {
        var urlParams = new URLSearchParams(window.location.search);
        if (window.location.pathname === "/filter" && urlParams.has('tag')) {

            core.setPkStatus('activeFilter', true);
            core.setPkStatus('filter', urlParams.getAll('tag'));

            document.title = 'Palmekartan - ' + printFilterString(core.getPkStatus('filter'));
            var obs = core.getAllObs().filter(function (o) {
                //if we have a tag param, filter allObs
                return core.getPkStatus('filter').every(function (f) {
                    //every filter must be present in tags
                    if (o.tags) {
                        //...if there are tags...
                        return o.tags.some(function (t) {
                            //...but can be some of all tags
                            return t === f;
                        });
                    }
                });
            });
            core.setObs(obs);
            setFilterDropDown();
            console.log('Filter! Found ' + obs.length + ' observations containing ', printFilterString(core.getPkStatus('filter')));
        } else core.setObs(core.getAllObs()); //if we don't have a filter, go with allObs as obs
        renderFilterStatus();
    }

    function renderFilterStatus() {
        var obs = core.getObs();
        var filters = core.getPkStatus('filter');
        var filterStatus = document.getElementById('nav-filterstatus');
        if (!core.getPkStatus('activeFilter')) {
            filterStatus.innerHTML = 'Visar alla ' + obs.length + ' observationer';
        } else {
            if (obs.length === 0) {
                filterStatus.innerHTML = '<span class="filter-color">Inga observationer taggade ' + printFilterString(filters) + '!</span>';
            } else filterStatus.innerHTML = 'Visar ' + obs.length + ' ' + (obs.length === 1 ? 'observation' : 'observationer') + ': <span class="filter-color">' + printFilterString(filters) + '</span>';
        }
    }

    /**
     * sets navbar filter checkbox from url param
     */
    function setFilterDropDown() {
        Array.from(document.querySelectorAll('.filter-checkbox')).forEach(function (checkbox) {
            core.getPkStatus('filter').forEach(function (f) {
                if (checkbox.getAttribute('data-id') === f) {
                    checkbox.checked = true;
                }
            });
        });
    }

    /**
     * Gets navbar filter checkboxes --> url param
     */
    function getFilterDropdown() {
        var query = '/filter?';
        var value = '';
        Array.from(document.querySelectorAll('.filter-checkbox')).forEach(function (el) {
            if (el.checked) {
                value += 'tag=' + el.getAttribute('data-id') + '&';
            }
        });

        if (value.length === 0) {
            return window.location.href = '/';
        }
        if (value[value.length - 1] === '&') {
            value = value.slice(0, value.lastIndexOf('&')); //removing last '&'
        }
        return window.location.href = query + value;
    }

    /**
     * prints mutiple filters more nicely
     * @param {array} arr 
     */
    function printFilterString(arr) {
        if (arr.length > 0) {
            if (arr.length === 1) {
                return arr[0];
            }
            var result = '';
            for (var i = 0; i < arr.length; i++) {

                result += arr[i];
                if (i < arr.length - 1) {
                    result += ' + ';
                }
            }
            return result;
        }
        return "";
    }

    return {
        checkUrlParams: checkUrlParams,
        checkLoadStatus: checkLoadStatus,
        monitorMapSettings: monitorMapSettings,
        monitorTimelineSettings: monitorTimelineSettings,
        timelineClick: timelineClick,
        getFilterDropdown: getFilterDropdown,
        filterObs: filterObs
    };
}();

//evt listeners
(function () {

    document.addEventListener('DOMContentLoaded', function () {
        index.monitorMapSettings();
        index.monitorTimelineSettings();
    });

    //renders about-text on nav-click
    document.getElementById('about-btn').addEventListener('click', function (e) {
        e.preventDefault();
        window.history.pushState(null, "", "/about");
        index.checkUrlParams();
    });

    //'ok' nav filtering 
    document.getElementById('filter-ok').addEventListener('click', index.getFilterDropdown);
})();