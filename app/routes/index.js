const port = 3000;

module.exports = function(app, db) {

    app.get('/', (req, res) => {
        res.sendFile(process.cwd() + '/index.html', (err) => {
            if (err) throw err;
        })
    })

    app.get('/form.html', (req, res) => {
        res.sendFile(process.cwd() + '/user/form.html', (err) => {
            if (err) throw err;
        })
    });

    app.post('/form.html', (req, res) => {
        console.log(req);
        res.sendFile(process.cwd() + '/user/form.html', (err) => {
            if (err) throw err;
        })
    });
    app.listen(port, () => {
        console.log('listening to port' + port);
    })


}