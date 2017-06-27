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
        placeMarker(e.latLng, map, false);
        latBox.value = e.latLng.lat();
        lngBox.value = e.latLng.lng();
    });

    //EDIT FORM function
    //Displays inherited marker 
    google.maps.event.addListenerOnce(map, 'idle', () => {
        if (latBox.value && lngBox.value) { //If page loads with something in coords-fields --> display on map
            return placeMarker({ lat: parseFloat(latBox.value), lng: parseFloat(lngBox.value) }, map, true);
        }
        return;
    })
}

/**
 * 
 * @param {object} location 
 * @param {map} map 
 * @param {bool} pan - Pan to marker location after adding it?
 */
function placeMarker(location, map, pan) {
    if (typeof obsMarker === 'object') { //if we don't have a marker, place it
        obsMarker.setPosition(location);
    } else { //if we have a marker, move it
        obsMarker = new google.maps.Marker({
            position: location,
            map: map,
            title: 'Observation',
            label: { text: 'Observation' }
        });
    }
    if (pan) {
        map.panTo(location);
    }

}

//Form buttons and boxes elements
let getAadressBtn = document.getElementById('coords-to-adress-btn');
let getCoordsBtn = document.getElementById('adress-to-coords-btn');
let addInterrogationBtn = document.getElementById('add-interrogation-btn');

let adressbox = document.getElementById('adress-box');
let latBox = document.getElementById('obs-lat-box');
let lngBox = document.getElementById('obs-lng-box');


getAadressBtn.addEventListener('click', getAdress);
getCoordsBtn.addEventListener('click', getCoords);
addInterrogationBtn.addEventListener('click', interrogationForm);

/**
 * Takes coords from latlong fields --> gets adress from Google geocode -> places it in adress field
 */
function getAdress() {
    if (!lngBox.value || !latBox.value) {
        alert('Det finns inga koordinater att hämta!')
    } else {
        getAadressBtn.firstChild.data = 'Hämtar...';
        geoCode('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latBox.value + ',' + lngBox.value, (response) => {
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
            latBox.value = lat;
            lngBox.value = lng;
            placeMarker({ lat: lat, lng: lng }, map, true); //also places it on map

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

/**
 * Adds 2 form fields & a button at each call
 * button click removes itself + parent element
 */
function interrogationForm() {
    let interContainer = document.getElementById('interrogation-container');
    let newfield = document.createElement('div');
    newfield.setAttribute('class', 'form-group form-inline');
    newfield.innerHTML = `
                <label for="interr-date" class="mr-2">Förhörsdatum:</label>
                <input type="date" name="interr-date" min="1986-02-28" class="form-control col-sm-3 mr-2" required>
                <label for="protocol" class="mr-2">URL-länk:</label>
                <input type="text" name="protocol" class="form-control col-sm-3 mr-2" required>
                <button type="button" class="btn btn-sm btn-danger mr-2 remove-interrogation-btn">Ta bort</button>
                `;

    interContainer.appendChild(newfield);

    let btns = document.querySelectorAll('.remove-interrogation-btn').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.target.parentNode.remove();
        })
    }, this);
}