const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

const DB_ACTIONS = require('./db');
const production = require('./components/production')(app);

app.set('view-engine', 'ejs');
app.use(express.static(__dirname + '/public', { maxAge: '5d' }));

app.get('/', (req, res) => {
    res.redirect('/lk');
});

app.get('/ajax/:countryCode', (req, res) => {
    DB_ACTIONS.getCities(req.params.countryCode)
        .then((data) => {
            res.header('Cache-Control', 'public, max-age=31557600');
            res.json(data);
        })
        .catch((err) => {
            res.send(err);
        });
});

app.get('/:countryCode/:city', (req, res) => {
    var country = {
        name: 'Sri Lanka',
        code: req.params.countryCode
    };

    DB_ACTIONS.findByCity(country.code, req.params.city)
        .then((data) => {
            res.render('pages/index.ejs', {
                country,
                placeholder: data.placename,
                city: data.placename,
                region: data.adminname2,
                postcode: data.postalcode,
                pageTitle: `${data.placename.toUpperCase()} Postcode | Sri Lanka Postal Codes`
            });
        })
        .catch((err) => {
            res.render('pages/404.ejs', {
                country,
                message: err,
                city: req.params.city
            });
        });
});

app.get('/:countryCode', (req, res) => {
    var country = {
        name: 'Sri Lanka',
        code: req.params.countryCode
    };

    DB_ACTIONS.getFirstCityName(country.code)
        .then((data) => {
            res.render('pages/index.ejs', {
                country,
                placeholder: data[0].placename,
                city: '',
                region: '',
                postcode: '',
                pageTitle: `Sri Lanka Postal Codes`
            });
        })
        .catch((err) => {
            res.render('pages/404.ejs', {
                country,
                message: err,
                city: ''
            });
        });
});

app.use(function (req, res, next) {
    res.render('pages/404.ejs', {
        country: {},
        message: '',
        city: ''
    });
});

app.listen(PORT, () => {
    console.log('Server started on port', PORT);
});