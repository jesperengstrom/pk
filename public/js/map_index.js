//remove these from global namespace, yet it has to be available for all map functions
var map;
var markers = [];
var witnessMarker;
const mordplatsen = { lat: 59.336615, lng: 18.062775 };

function initMap() {

    //map options
    var noBusiness = [{
        featureType: 'poi.business',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
    }]

    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('indexmap'), {
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

    witnessMarker = new google.maps.Marker({
        map: null,
        title: 'Vittne',
        label: { text: 'Vittne' },
        animation: google.maps.Animation.DROP
    });

    opMarker = new google.maps.Marker({
        map: null,
        title: 'Olof Palme',
        label: { text: 'Olof Palme' },
        animation: google.maps.Animation.DROP
    });

}

/**
 * Creates all the markers when obs-array is available
 */
function createObsMarkers() {
    var onMap;
    pkSettings.showAllMarkers ? onMap = map : onMap = null; //displaying them on map or not depending on setting
    obs.forEach((el) => {
        var newMarker = new google.maps.Marker({
            map: onMap,
            position: {
                lat: el.obsLocation.coords.lat,
                lng: el.obsLocation.coords.lng
            },
            title: "Observation " + el.title,
            marker_id: el._id,
            // label: { text: title },
        });
        markers.push(newMarker);
        //Makes the labels clickable
        newMarker.addListener('click', () => {
            map.panTo(newMarker.position)
            hideContextMarker('witnessLocation');
            hideContextMarker('opLocation');
            let id = newMarker.marker_id;
            ajaxRequest('GET', server + '/api/search?id=' + id, displayFullObs);
        });
    })
}

/**
 * Displaying one obs marker (id match) on the map - if checkbox option: all not set
 * @param {string} id 
 */
function showObsMarker(id) {
    markers.forEach((el) => {
        if (!pkSettings.showAllMarkers) {
            el.setMap(null);
        }
        if (el.marker_id === id) {
            el.setMap(map);
            el.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => { el.setAnimation(null); }, 750);
            map.panTo(el.position);
            if (!pkSettings.showAllMarkers) {
                el.setAnimation(google.maps.Animation.DROP);
            }
        }
    }, this);
}

/**
 * Called on checkbox click in nav bar
 */
function toggleObsMarkers() {
    let i = 0;
    markers.forEach((el) => {
        if (!pkSettings.showAllMarkers) {
            el.setMap(null)
        } else {
            setTimeout(function() {
                el.setMap(map);
                el.setAnimation(google.maps.Animation.DROP)
            }, i * 100);
            i++;
            map.panTo(mordplatsen);
        }
    })
}

/**
 * called on checkbox click in full obs section
 * @param {DOM element} el - contains coords as data-attr
 * @param {string} target - which of the 2 markers we target
 */
function showContextMarker(el, target) {
    let activeMarker;
    target === 'witnessLocation' ? activeMarker = witnessMarker : activeMarker = opMarker;
    activeMarker.setPosition({
        lat: parseFloat(el.getAttribute('data-lat')),
        lng: parseFloat(el.getAttribute('data-lng'))
    })
    activeMarker.setAnimation(google.maps.Animation.DROP)
    activeMarker.setMap(map)
}

function hideContextMarker(target) {
    let activeMarker;
    target === 'witnessLocation' ? activeMarker = witnessMarker : activeMarker = opMarker;
    activeMarker.setMap(null);
}

/**
 * Toggles street view and calculates the heading between two markers
 * @param {DOM element} target 
 */
function showStreetView(target) {
    var witnessLoc = new google.maps.LatLng(parseFloat(target.getAttribute('data-witnesslat')), parseFloat(target.getAttribute('data-witnesslng')));
    var obsLoc = new google.maps.LatLng(parseFloat(target.getAttribute('data-obslat')), parseFloat(target.getAttribute('data-obslng')));

    let panorama = map.getStreetView();
    panorama.setPosition(witnessLoc);

    //calculates where the camera is aimed (from our witness to the observation)
    let heading = google.maps.geometry.spherical.computeHeading(witnessLoc, obsLoc);

    panorama.setPov({
        heading: heading,
        pitch: 0,
        zoom: 1
    });
    panorama.setVisible(true);
}