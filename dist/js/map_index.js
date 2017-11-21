'use strict';

//index map module

var indexMap = function () {
    var map;
    var markers = [];
    var witnessMarker, opMarker;
    var mordplatsen = { lat: 59.33663539974593, lng: 18.062767580127 };

    function getMarkers() {
        return markers;
    }

    function initMap() {

        //map options
        // var noBusiness = [{
        //     featureType: 'poi.business',
        //     elementType: 'labels',
        //     stylers: [{ visibility: 'off' }]
        // }]

        var dark = [{
            "stylers": [{
                "hue": "#ff1a00"
            }, {
                "invert_lightness": true
            }, {
                "saturation": -100
            }, {
                "lightness": 33
            }, {
                "gamma": 0.6
            }]
        }, {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#2D333C"
            }]
        }, {
            'featureType': 'poi.business',
            'elementType': 'labels',
            'stylers': [{ 'visibility': 'off' }]
        }];

        // Create a map object and specify the DOM element for display.
        map = new google.maps.Map(document.getElementById('indexmap'), {
            scrollwheel: false,
            styles: dark,
            clickableIcons: false
        });

        // Static markers
        var mordplatsenMarker = new google.maps.Marker({
            map: map,
            position: mordplatsen,
            title: 'Mordplatsen',
            icon: mapPin('red', 0.8, 0.6),
            label: mapLabel("\uF0F9")
        });

        var opResidence = new google.maps.Marker({
            map: map,
            position: { lat: 59.32504170000001, lng: 18.0694926 },
            title: 'Palmes bostad',
            icon: mapPin('red', 0.8, 0.6),
            label: mapLabel("\uF015")
        });

        var grand = new google.maps.Marker({
            map: map,
            position: { lat: 59.339166289828945, lng: 18.059799850052514 },
            title: 'Biografen Grand',
            icon: mapPin('red', 0.8, 0.6),
            label: mapLabel("\uF03D")
        });

        witnessMarker = new google.maps.Marker({
            map: null,
            title: 'Vittne',
            icon: mapPin('#00CCBB', 0.8, 0.6),
            label: mapLabel("\uF06E"),
            clickable: false,
            animation: google.maps.Animation.DROP
        });

        opMarker = new google.maps.Marker({
            map: null,
            title: 'Olof Palme',
            icon: mapPin('brown', 0.8, 0.6),
            label: mapLabel("\uF05B"),
            clickable: false,
            animation: google.maps.Animation.DROP
        });
    }

    function mapPin(color, scale, opac) {
        return {
            path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
            fillColor: color,
            fillOpacity: opac,
            strokeColor: '',
            strokeWeight: 0,
            scale: scale,
            labelOrigin: new google.maps.Point(0, -25)
        };
    }

    function mapLabel(facode) {
        return {
            fontFamily: 'Fontawesome',
            text: facode,
            color: 'white'
        };
    }

    /**
     * Creates all the markers when obs-array is available
     */
    function createObsMarkers() {
        var obs = core.getObs();
        var onMap;
        core.getPkSettings('allMarkers') ? onMap = map : onMap = null; //displaying them on map or not depending on setting
        if (obs !== null) {
            obs.forEach(function (el) {
                var newMarker = new google.maps.Marker({
                    map: onMap,
                    icon: mapPin('#086787', 0.8, 0.6),
                    label: mapLabel("\uF183"),
                    position: {
                        lat: el.obsLocation.coords.lat,
                        lng: el.obsLocation.coords.lng
                    },
                    title: "Observation " + el.title,
                    marker_id: el._id
                });
                markers.push(newMarker);
                newMarker.addListener('click', function () {
                    //happens when we click a marker
                    indexTimeline.fitAllOnTimeLine(); //so we see the active obs
                    if (map.getBounds().contains(newMarker.position) == false) {
                        //pan map if marker not in bounds
                        map.panTo(newMarker.position);
                    }
                    hideContextMarker('witnessLocation');
                    hideContextMarker('opLocation');
                    var id = newMarker.marker_id;
                    window.history.pushState(null, "", "/observation?id=" + id); //changes the URL to include id query string to full post
                    index.checkUrlParams();
                });
            });
        } else console.log('obs was empty, could not place markers.');

        core.setPkStatus('markersPlaced', true);
        index.checkUrlParams(); //obs in storage, markers pushed --> now we can render a full obs
    }

    /**
     * Set bounds for map to show all markers
     */
    function setMapBounds() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
        }
        map.fitBounds(bounds);
    }

    /**
     * Displaying / highlighting one obs marker (id match) on the map
     * @param {string} id 
     */
    function showObsMarker(id) {
        markers.forEach(function (el) {
            if (!core.getPkSettings('allMarkers')) {
                el.setMap(null);
            }
            if (el.marker_id === id) {
                el.setMap(map);
                el.setOptions({ icon: mapPin('#086787', 1, 0.6) });
                el.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function () {
                    el.setAnimation(null);
                }, 750);
                if (map.getZoom() < 16) {
                    //zoom to 16 if less, don't zoom out
                    map.setZoom(16);
                }
                if (map.getBounds() && map.getBounds().contains(el.position) == false) {
                    //pan map if marker not in bounds
                    map.panTo(el.position);
                }
                if (!core.getPkSettings('allMarkers')) {
                    //drop a single marker (bounce if all)
                    el.setAnimation(google.maps.Animation.DROP);
                }
            } else {
                el.setOptions({ icon: mapPin('#086787', 0.8, 0.3) });
            }
        }, this);
    }

    /**
     * Called on checkbox click in nav bar
     */
    function toggleObsMarkers() {
        var i = 0;
        markers.forEach(function (el) {
            if (!core.getPkSettings('allMarkers')) {
                if (core.getPkStatus('activeId') === el.marker_id) el.setMap(map); //keep the currently open observation marker
                else el.setMap(null);
            } else {
                setTimeout(function () {
                    el.setMap(map);
                    el.setAnimation(google.maps.Animation.DROP);
                }, i * 100);
                i++;
                setMapBounds();
            }
        });
    }

    /**
     * called on checkbox click in full obs section
     * @param {DOM element} el - contains coords as data-attr
     * @param {string} target - which of the 2 markers we target
     */
    function showContextMarker(el, target) {
        var activeMarker = void 0;
        target === 'witnessLocation' ? activeMarker = witnessMarker : activeMarker = opMarker;
        activeMarker.setPosition({
            lat: parseFloat(el.getAttribute('data-lat')),
            lng: parseFloat(el.getAttribute('data-lng'))
        });
        activeMarker.setAnimation(google.maps.Animation.DROP);
        activeMarker.setMap(map);
    }

    function hideContextMarker(target) {
        var activeMarker = void 0;
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

        var panorama = map.getStreetView();
        panorama.setPosition(witnessLoc);

        //calculates where the camera is aimed (from our witness to the observation)
        var heading = google.maps.geometry.spherical.computeHeading(witnessLoc, obsLoc);

        panorama.setPov({
            heading: heading,
            pitch: 0,
            zoom: 1
        });
        panorama.setVisible(true);
    }

    return {
        initMap: initMap,
        getMarkers: getMarkers,
        showObsMarker: showObsMarker,
        createObsMarkers: createObsMarkers,
        toggleObsMarkers: toggleObsMarkers,
        showContextMarker: showContextMarker,
        hideContextMarker: hideContextMarker,
        showStreetView: showStreetView,
        setMapBounds: setMapBounds
    };
}();