const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname + '/db/postcodes.db');

const requiredColumns = 'placename, adminname2, postalcode';

function DB (action, query) {
    return new Promise(function (resolve, reject) {
        db[action](query, (err, rows) => {
            if (err) reject(err);

            resolve(rows);
        })
    })
}

module.exports = {
    /* Example:
     * DB_ACTIONS.findByCity(countryCode, _.startCase(req.params.city));
     * */
    findByCity: (countryCode, city) => {
        return DB('get', `SELECT ${requiredColumns} FROM ${countryCode} WHERE placename="${city}" COLLATE NOCASE`);
    },
    /* Example:
     * DB_ACTIONS.findByPostcode(countryCode, '10290');
     * */
    findByPostcode: (countryCode, postcode) => {
        return DB('get', `SELECT ${requiredColumns} FROM ${countryCode} WHERE postalcode="${postcode}"`);
    },
    getFirstCityName: (countryCode) => {
        return DB('all', `SELECT placename FROM ${countryCode} LIMIT 1`);
    },
    getCities: (countryCode) => {
        return DB('all', `SELECT ${requiredColumns} FROM ${countryCode}`);
    }
};