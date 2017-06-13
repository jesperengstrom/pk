const server = 'http://localhost:3000';
//need to put this in a module
var obs = [];


$(document).ready(() => {
    const allUrl = server + '/api/all';
    ajaxRequest('GET', allUrl, storeObs);
});


function ajaxRequest(method, url, callback) {
    $.ajax({
        method: 'GET',
        url: url,
        dataType: 'json',
        success: (response) => {
            callback(response);
        },
        error: (err) => {
            console.log('Error!', err.statusText);
        }
    })
}

//this calls maps when observation are gotten & stored
function storeObs(observations) {
    obs = observations;
    for (let i in obs) {
        obs[i].dateTime = new Date(observations[i].dateTime.date + " " + observations[i].dateTime.time);
    }
    //now we have all the coords, add all markers here
    addAllMarkers();

}


function timelineClick() {
    let places = document.querySelectorAll('.observation-link').forEach((el) => {
        el.addEventListener('click', () => {
            let id = el.getAttribute('data-id');
            let name = el.getAttribute('data-name');
            let latlong = {
                lat: parseFloat(el.getAttribute('data-lat')),
                lng: parseFloat(el.getAttribute('data-long'))
            };
            newMarker(latlong, name);
            ajaxRequest('GET', server + '/api/search/' + id, displayFullObs);

        })
    })
}