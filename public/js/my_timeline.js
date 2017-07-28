//Client-side, handles rendering of map
var timeline;

//static events on timeline
let redEvents = [
    [new Date('1986/02/28 23:21:00'), , '<span class="timeline-text op-event-content">Mordet</span>'],
    [new Date('1986/02/28 20:35:00'), , '<span class="timeline-text op-event-content">Lämnar bostaden</span>'],
    [new Date('1986/02/28 20:55:00'), , '<span class="timeline-text op-event-content">Ankommer Grand</span>'],
    [new Date('1986/02/28 23:15:00'), , '<span class="timeline-text op-event-content">Lämnar Grand</span>'],
];

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
    // data.addRows(redEvents);
    data.addRows(insertEvents());


    // specify options
    const options = {
        "width": "100%",
        "height": "auto",
        "style": "box",
        "axisOnTop": true,
        "selectable": false,
        "min": new Date('1986-02-01'),
        "max": new Date('1986-03-02'),
        "locale": "se_SE",
        "stackEvents": false,
        "showCurrentTime": false,
        "zoomMax": 31536000000,
        "zoomMin": 60000,
        "cluster": true
    };

    // Instantiate our timeline object.
    timeline = new links.Timeline(document.getElementById('mytimeline'));

    // Draw our timeline with the created data and options
    timeline.setOptions(options);

    // draw is ready -> create event listeners etc, set ready to true and check for url-params
    google.visualization.events.addListener(timeline, 'ready', () => {
        opRedBox();
        timelineClick();
        timelineReady = true;
        checkUrlParams();
        setMapBounds(); //set map bounds once timeline is loaded to prevent hidden markers
    });
    timeline.draw(data);
}

/**
 * Returns array of arrays to insert as rows into timeline
 */
function insertEvents() {
    let rows = [];
    if (obs !== null) {
        obs.forEach((element) => {
            rows.push([dateToUTC(element.obsDate), ,
                `<a href="" class="observation-link timeline-text" data-id=${element._id}>${element.title}</a>`
            ])
        }, this);
        rows.push(...redEvents) //add static events w spread!
    } else console.log('obs was empty, could not place timeline items.')

    return rows;
}

//place items at UTC time, no strange timezone conversion
function dateToUTC(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}

//colours all op-events on timeline bg red
function opRedBox() {
    document.querySelectorAll('.op-event-content').forEach(function(element) {
        element.parentElement.parentElement.classList.add('op-event');
    }, this);
}