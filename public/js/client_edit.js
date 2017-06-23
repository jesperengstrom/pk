(function() {
    const server = 'http://localhost:3000';
    var obs = [];

    document.addEventListener('DOMContentLoaded', () => {
        const allUrl = server + '/api/all';
        if (typeof(Storage) !== "undefined" && sessionStorage.getItem('obs')) { // Session storage is available && set
            console.log('Getting object from session storage')
            let retrieved = JSON.parse(sessionStorage.getItem('obs'));
            storeObs(retrieved);
        } else { // No storage support / not set
            console.log('Ajax:ing object from database...');
            ajaxRequest('GET', allUrl, storeObs);
        }
    })

    function ajaxRequest(method, url, callback) {
        $.ajax({
            method: method,
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

    /**
     * callback function for when observations are ready
     * @param {array} observations 
     */
    function storeObs(observations) {
        obs = observations;
        for (let i in obs) {
            obs[i].obsDate = new Date(observations[i].obsDate);
            obs[i].coords.lat = parseFloat(observations[i].coords.lat);
            obs[i].coords.lng = parseFloat(observations[i].coords.lng);
        }
        if (typeof(Storage) !== "undefined" && sessionStorage.getItem('obs') == null) { //session storage available but not set
            console.log('storing object in session storage...')
            sessionStorage.setItem('obs', JSON.stringify(obs));
        }
        renderlist();
    }

    function renderlist() {
        let listEl = document.getElementById('edit-list-body');
        let sorted = obs.sort((a, b) => {
            return b.obsDate - a.obsDate;
        });
        console.log(obs);
        let html = ``;
        for (let i in sorted) {
            html += `<tr>
                        <td>${sorted[i].name}</td>
                        <td>${sorted[i].obsDate}</td>
                        <td><a href="/users/editform?id=${sorted[i]._id}">redigera</a> 
                    </tr>`
        }
        listEl.innerHTML = html;
    }
})();