//remove these from global namespace, yet it has to be available for all map functions
var map;
var markers = [];
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
}

/**
 * Creates all the markers when obs-array is available
 */
function createMarkers() {
    var onMap;
    pkSettings.showAllMarkers ? onMap = map : onMap = null; //displaying them on map or not depending on setting
    obs.forEach((el) => {
        var newMarker = new google.maps.Marker({
            map: onMap,
            position: {
                lat: el.coords.lat,
                lng: el.coords.lng
            },
            title: el.name,
            marker_id: el._id,
            // label: { text: title },
        });
        markers.push(newMarker);
        //Makes the labels clickable
        newMarker.addListener('click', () => {
            map.panTo(newMarker.position)
            let id = newMarker.marker_id;
            ajaxRequest('GET', server + '/api/search?id=' + id, displayFullObs);
        });
    })
}

/**
 * Displaying one marker (id match) on the map - if option:all not set
 * @param {string} id 
 */
function showMarker(id) {
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
 * Shows or hides all markers
 */
function toggleMarkers() {
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