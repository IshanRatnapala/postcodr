const _ = require('lodash');
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

const DB_ACTIONS = require('./db');

app.set('view-engine', 'ejs');
app.use(express.static(__dirname + '/public', { maxAge: '5d' }));

app.get('/', (req, res) => {
    let countryCode = 'LK';
    //send the cities for the countries

    DB_ACTIONS.getCities(countryCode)
        .then((data) => {
            res.render('pages/index.ejs', {
                cities: data
            });
        })
        .catch((err) => {
            throw err;
        });
});

app.get('/postcode/:countryCode/:city', (req, res) => {
    // res.send('Postcode information for ' + req.params.city);
    DB_ACTIONS.findByCity(req.params.countryCode.toUpperCase(), _.startCase(req.params.city));
    DB_ACTIONS.findByPostcode(req.params.countryCode.toUpperCase(), '10290');

    res.render('pages/detail.ejs');
});

app.get('/ajax/:countryCode', (req, res) => {
    DB_ACTIONS.getCities(req.params.countryCode)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            throw err;
        });


});

app.listen(PORT, () => {
    console.log('Server started on port', PORT);
});