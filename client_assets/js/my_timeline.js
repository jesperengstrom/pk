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

    data.addRows([
        [new Date(1986, 01, 29), , 'Phone call'],
        [new Date(1986, 01, 31), , 'Traject B'],
        [new Date(1986, 02, 4, 12, 0, 0), , '<a href="http//www.example.com">Report<a>']
    ]);

    // specify options
    var options = {
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
        "style": "dot",
        "zoomMax": 31536000000,
        "zoomMin": 60000

    };

    // Instantiate our timeline object.
    var timeline = new links.Timeline(document.getElementById('mytimeline'));

    // Draw our timeline with the created data and options
    timeline.setOptions(options);
    timeline.draw(data);
}