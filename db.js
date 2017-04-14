const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname + '/db/postcodes.db');

function DB_GET (query) {
    db.get(query, (err, rows) => {
        if (err) throw err;

        console.log(rows);
    })
}

module.exports = {
    findByCity: (countryCode, city) => {
        DB_GET(`SELECT * FROM ${countryCode} WHERE placename="${city}"`);
    },
    findByPostcode: (countryCode, postcode) => {
        DB_GET(`SELECT * FROM ${countryCode} WHERE postalcode="${postcode}"`);
    }
};