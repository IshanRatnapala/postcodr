const _ = require('lodash');
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

const DB_ACTIONS = require('./db');
const production = require('./components/production')(app);

app.set('view-engine', 'ejs');
app.use(express.static(__dirname + '/public', { maxAge: '5d' }));


app.get('/', (req, res) => {
    res.redirect('/postcode/LK');
});

app.get('/postcode/:countryCode', (req, res) => {
    var countryCode = req.params.countryCode.toUpperCase();
    DB_ACTIONS.getCities(countryCode)
        .then((data) => {
            res.render('pages/index.ejs', {
                countryCode: countryCode.toLowerCase(),
                cities: data,
                query: ''
            });
        })
        .catch((err) => {
            throw err;
        });
});

app.get('/postcode/:countryCode/:city', (req, res) => {
    var countryCode = req.params.countryCode.toUpperCase();
    DB_ACTIONS.getCities(countryCode)
        .then((data) => {
            res.render('pages/index.ejs', {
                countryCode: countryCode.toLowerCase(),
                cities: data,
                query: req.params.city.toLowerCase()
            });
        })
        .catch((err) => {
            throw err;
        });

});

app.listen(PORT, () => {
    console.log('Server started on port', PORT);
});