//remove these from global namespace, yet it has to be available for all map functions
var map;
const mordplatsen = { lat: 59.336615, lng: 18.062775 };
var obsMarker;

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
    const mainMarker = new google.maps.Marker({
        map: map,
        position: mordplatsen,
        title: 'Mordplatsen',
        label: { text: 'Mordplatsen' }
    });

    map.addListener('click', (e) => {
        placeMarker(e.latLng, map);
        latbox.value = e.latLng.lat();
        lngbox.value = e.latLng.lng();
    });
}


function placeMarker(location, map) {
    if (typeof obsMarker === 'object') { //if we don't have a marker, place it
        obsMarker.setPosition(location);
    } else { //if we have a marker, move it
        obsMarker = new google.maps.Marker({
            position: location,
            map: map
        });
    }
    map.panTo(location);
}

//Form buttons and boxes elements
let getAadressBtn = document.getElementById('coords-to-adress-btn');
let getCoordsBtn = document.getElementById('adress-to-coords-btn');

let adressbox = document.getElementById('adress-box');
let lngbox = document.getElementById('lng-box');
let latbox = document.getElementById('lat-box')

getAadressBtn.addEventListener('click', getAdress);
getCoordsBtn.addEventListener('click', getCoords);

/**
 * Takes coords from latlong fields --> gets adress from Google geocode -> places it in adress field
 */
function getAdress() {
    if (!lngbox.value || !latbox.value) {
        alert('Det finns inga koordinater att hämta!')
    } else {
        getAadressBtn.firstChild.data = 'Hämtar...';
        geoCode('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latbox.value + ',' + lngbox.value, (response) => {
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
            latbox.value = lat;
            lngbox.value = lng;
            placeMarker({ lat: lat, lng: lng }, map); //also places it on map

            getCoordsBtn.firstChild.data = 'Sätt koordinater';
            console.log(response);
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