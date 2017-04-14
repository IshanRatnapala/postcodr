const _ = require('lodash');
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

const DB_ACTIONS = require('./db');

app.set('view-engine', 'ejs');

app.get('/', (req, res) => {
    res.send('Hello there - This is the home page. You can search for/filter postcodes here.');
});

app.get('/:countryCode/:city', (req, res) => {
    res.send('Postcode information for ' + req.params.city);
    DB_ACTIONS.findByCity(req.params.countryCode.toUpperCase(), _.startCase(req.params.city));
    DB_ACTIONS.findByPostcode(req.params.countryCode.toUpperCase(), '10290');
});

app.listen(PORT, () => {
    console.log('Server started on port', PORT);
});