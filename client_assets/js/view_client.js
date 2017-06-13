//Displays db-objects outside of timeline & map

function displayFullObs(res) {
    let obs = res[0];
    let obsContent = document.querySelector('#obs-content');
    obsContent.innerHTML =
        `<h2>${obs.name}</h2>
        <p><span class="lead">datum: </span>${obs.dateTime.date}</p>
        <p><span class="lead">Tid: </span>${obs.dateTime.time}</p>
        `
}