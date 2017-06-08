const bodyParser = require('body-parser')
const controller = require(process.cwd() + '/app/controllers/controller_server.js')

module.exports = function(app, db) {

    //new instance of controller object - all methods gets db
    const serverController = new controller(db);

    //posting
    app.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json());
    app.post('/api/post.html', (req, res) => {
        serverController.addDocu(req.body);
        res.writeHead(302, { 'Location': '/' });
        res.end();
    });

    app.get('/api/get.html', (req, res) => {
        serverController.getAllDocs(req, res);
    })

}