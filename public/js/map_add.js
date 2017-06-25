//remove these from global namespace, yet it has to be available for all map functions
var map;
const mordplatsen = { lat: 59.336615, lng: 18.062775 };
var obsMarker;
var obsLat;
var obsLng

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
        obsLat = e.latLng.lat();
        obsLng = e.latLng.lng()
        placeCoords(obsLat, obsLng);
    });

}


function placeMarker(location, map) {
    if (typeof obsMarker === 'object') {
        obsMarker.setPosition(location);
    } else {
        obsMarker = new google.maps.Marker({
            position: location,
            map: map
        });
    }
}

function placeCoords(lat, lng) {
    let latbox = document.getElementById('lat-box').value = lat;
    let lngbox = document.getElementById('lng-box').value = lng;
}

//Adress buttons
document.getElementById('coords-to-adress-btn').addEventListener('click', getAdress)
document.getElementById('adress-to-coords-btn').addEventListener('click', getCoords)
let adressbox = document.getElementById('adress-box');

function getAdress() {
    if (!obsLat) {
        alert('Det finns inga koordinater att hämta ifrån!')
    } else {
        adressbox.value = 'Hämtar...'
        $.ajax({
            method: 'GET',
            url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + obsLat + ',' + obsLng,
            dataType: 'json',
            success: (response) => {
                console.log(response);
                let street = response.results["0"].address_components[1].long_name;
                let streetno = response.results["0"].address_components["0"].long_name
                adressbox.value = street + " " + streetno;
            },
            error: (err) => {
                alert('Kunde inte hämta adress', err.statusText);
            }
        })
    }
}

function getCoords() {
    if (!adressbox.value) {
        alert('Adressrutan är tom!');
    } else {
        let adress = adressbox.value
    }
    'http://maps.google.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA'
}