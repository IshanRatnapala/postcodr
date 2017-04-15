const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname + '/db/postcodes.db');

function DB (action, query) {
    return new Promise(function (resolve, reject) {
        db[action](query, (err, rows) => {
            if (err) reject(err);

            resolve(rows);
        })
    })

}

module.exports = {
    findByCity: (countryCode, city) => {
        return DB('get', `SELECT * FROM ${countryCode} WHERE placename="${city}"`);
    },
    findByPostcode: (countryCode, postcode) => {
        return DB('get', `SELECT * FROM ${countryCode} WHERE postalcode="${postcode}"`);
    },
    getCities: (countryCode) => {
        return DB('all', `SELECT placename, postalcode FROM ${countryCode}`);
    }
};