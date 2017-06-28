//remove these from global namespace, yet it has to be available for all map functions
var map;
const mordplatsen = { lat: 59.336615, lng: 18.062775 };

//Form buttons and boxes elements
var getAadressBtn = document.getElementById('coords-to-adress-btn');
var getCoordsBtn = document.getElementById('adress-to-coords-btn');
var adressbox = document.getElementById('adress-box');

//active objects
var activeBox, activeMarker;

//objects that can be made active
var obsMarker, witnessMarker, palmeMarker;
var obsBox = { lat: document.getElementById('obs-lat-box'), lng: document.getElementById('obs-lng-box') }

var defaultSettings = (function defset() { //self invoking but can also be called, activates default = observation
    activeBox = obsBox;
    activeMarker = obsMarker;
    return defset;
})();

getAadressBtn.addEventListener('click', getAdress);
getCoordsBtn.addEventListener('click', getCoords);

function initMap() {

    //map options
    var noBusiness = [{
        featureType: 'poi.business',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
    }]

    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('addmap'), {
        center: mordplatsen,
        scrollwheel: false,
        zoom: 15,
        styles: noBusiness
    });

    // Static marker
    const murderMarker = new google.maps.Marker({
        map: map,
        position: mordplatsen,
        title: 'Mordplatsen',
        label: { text: 'Mordplatsen' }
    });

    //witness marker invisible by default
    witnessMarker = new google.maps.Marker({
        position: mordplatsen,
        map: null,
        title: 'Vittne',
        label: { text: 'Vittne' },
        moved: false
    });

    //Palme marker invisible by default
    palmeMarker = new google.maps.Marker({
        position: mordplatsen,
        map: null,
        title: 'Palme',
        label: { text: 'Palme' },
        moved: false
    });

    map.addListener('click', (e) => {
        placeMarker(e.latLng, map, false);
        activeBox.lat.value = e.latLng.lat();
        activeBox.lng.value = e.latLng.lng();
    });

    //EDIT FORM function
    //Displays inherited marker 
    google.maps.event.addListenerOnce(map, 'idle', () => {
        if (activeBox.lat.value && activeBox.lng.value) { //If page loads with something in coords-fields --> display on map
            return placeMarker({ lat: parseFloat(activeBox.lat.value), lng: parseFloat(activeBox.lng.value) }, map, true);
        }
        return;
    })
}

/**
 * 
 * @param {object} location 
 * @param {map} map 
 * @param {bool} pan - If pan to marker location after adding it
 */
function placeMarker(location, map, pan) { //Should have option to not always effect active marker (set position btn)
    if (typeof activeMarker === 'object') { //if we have a marker, move it 
        activeMarker.setPosition(location);
    } else { //if we don't have a marker, place it
        obsMarker = new google.maps.Marker({
            position: location,
            map: map,
            title: 'Observation',
            label: { text: 'Observation' }
        });
        activeMarker = obsMarker;
    }
    if (pan) {
        map.panTo(location);
    }
}

/**
 * displays target marker obj + input box refs and sets all as active
 */
function activateMarker(target) {
    target === 'witness' ? activeMarker = witnessMarker : activeMarker = palmeMarker;
    if (!activeMarker.moved) { //if we haven't moved marker previously...
        activeMarker.setPosition(obsMarker === undefined ? mordplatsen : obsMarker.getPosition()); //place it at observation if it's defined, else mordplatsen
        activeMarker.moved = true; //and say we've moved it, else it will reset on next check.
    }
    activeMarker.setMap(map);
    activeBox = { lat: document.getElementById(target + '-lat-box'), lng: document.getElementById(target + '-lng-box') }

}

/**
 * Sets observation as default marker
 */
function deactivateMarker() {
    defaultSettings();
}


/**
 * Takes coords from latlong fields --> gets adress from Google geocode -> places it in adress field
 */
function getAdress() {
    if (!obsBox.lat.value || !obsBox.lng.value) {
        alert('Det finns inga koordinater att hämta!')
    } else {
        getAadressBtn.firstChild.data = 'Hämtar...';
        geoCode('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + obsBox.lat.value + ',' + obsBox.lng.value, (response) => {
            let street = response.results["0"].address_components[1].long_name;
            let streetno = response.results["0"].address_components["0"].long_name;
            adressbox.value = street + " " + streetno;
            getAadressBtn.firstChild.data = 'Hämta adress';
        })
    }
}

/**
 * Takes adress from adress field --> gets coords from google geocode --> places it in latlong field 
 */
function getCoords() {
    if (!adressbox.value) {
        alert('Adressrutan är tom!');
    } else {
        getCoordsBtn.firstChild.data = 'Hämtar...';
        let adress = adressbox.value + ", Stockholm, Sverige";
        geoCode('http://maps.google.com/maps/api/geocode/json?address=' + adress, (response) => {
            let lat = response.results["0"].geometry.location.lat;
            let lng = response.results["0"].geometry.location.lng;
            obsBox.lat.value = lat;
            obsBox.lng.value = lng;
            placeMarker({ lat: lat, lng: lng }, map, true); //also places it on map

            getCoordsBtn.firstChild.data = 'Sätt koordinater';
        })
    }
}

/**
 * Using ajax to get data from google geocode
 * @param {string} url 
 * @param {function} callback 
 */
function geoCode(url, callback) {
    $.ajax({
        method: 'GET',
        url: url,
        dataType: 'json',
        success: (response) => {
            callback(response);
        },
        error: (err) => {
            alert('Fel vid hämtning! ' + err.statusText);
        }
    })
}