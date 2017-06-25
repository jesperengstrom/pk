//Client-side, handles rendering of map

google.load("visualization", "1");

// Set callback to run when API is loaded
google.setOnLoadCallback(drawVisualization);

// Called when the Visualization API is loaded.
function drawVisualization() {
    // Create and populate a data table.
    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'start');
    data.addColumn('datetime', 'end');
    data.addColumn('string', 'content');

    //calling the functions that return the observations that we wanna insert
    data.addRows(insertObs());


    // specify options
    const options = {
        "width": "100%",
        "height": "auto",
        "style": "box", // optional
        "axisOnTop": true,
        "selectable": false,
        "min": [new Date(1986, 1, 01)],
        "max": [new Date(1986, 2, 28)],
        "locale": "se_SE",
        "stackEvents": false,
        "showCurrentTime": false,
        // "style": "dot",
        "zoomMax": 31536000000,
        "zoomMin": 60000

    };

    // Instantiate our timeline object.
    var timeline = new links.Timeline(document.getElementById('mytimeline'));
    // Draw our timeline with the created data and options
    timeline.setOptions(options);
    // listener 2 know when draw is ready -> create event listeners etc
    google.visualization.events.addListener(timeline, 'ready', timelineClick);
    timeline.draw(data);
}

/**
 * Returns array of arrays / inserts observations as rows into timeline
 */
function insertObs() {
    let rows = [];

    obs.forEach((element) => {
        rows.push([element.obsDate, ,
            `<a href="#" 
            class="observation-link"
            data-id=${element._id}
            data-name=${element.name} 
            data-lat=${element.coords.lat} 
            data-lng=${element.coords.lng}>
            ${element.name}</a>`
        ])
    }, this);
    return rows;
}