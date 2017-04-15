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
    /* Example:
     * DB_ACTIONS.findByCity(countryCode, _.startCase(req.params.city));
     * */
    findByCity: (countryCode, city) => {
        return DB('get', `SELECT * FROM ${countryCode} WHERE placename="${city}"`);
    },
    /* Example:
     * DB_ACTIONS.findByPostcode(countryCode, '10290');
     * */
    findByPostcode: (countryCode, postcode) => {
        return DB('get', `SELECT * FROM ${countryCode} WHERE postalcode="${postcode}"`);
    },
    getCities: (countryCode) => {
        return DB('all', `SELECT placename, postalcode FROM ${countryCode}`);
    }
};