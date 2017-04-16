const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

const DB_ACTIONS = require('./db');
const production = require('./components/production')(app);

app.set('view-engine', 'ejs');
app.use(express.static(__dirname + '/public', { maxAge: '5d' }));

app.get('/', (req, res) => {
    res.redirect('/postcode/lk');
});

app.get('/postcode/:countryCode', (req, res) => {
    var countryCode = req.params.countryCode.toUpperCase();

    DB_ACTIONS.getFirstCityName(countryCode)
        .then((data) => {
            res.render('pages/index.ejs', {
                countryCode: countryCode.toLowerCase(),
                placeholder: data[0].placename,
                city: '',
                region: '',
                postcode: '',
                pageTitle: `Sri Lanka Postal Codes`
            });
        })
        .catch((err) => {
            throw err;
        });
});

app.get('/postcode/:countryCode/:city', (req, res) => {
    var countryCode = req.params.countryCode.toUpperCase();

    DB_ACTIONS.findByCity(countryCode, req.params.city)
        .then((data) => {
            res.render('pages/index.ejs', {
                countryCode: countryCode.toLowerCase(),
                placeholder: data.placename,
                city: data.placename,
                region: data.adminname2,
                postcode: data.postalcode,
                pageTitle: `${data.placename.toUpperCase()} Postcode | Sri Lanka Postal Codes`
            });
        })
        .catch((err) => {
            throw err;
        });
});

app.get('/ajax/:countryCode', (req, res) => {
    var countryCode = req.params.countryCode.toUpperCase();
    DB_ACTIONS.getCities(countryCode)
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