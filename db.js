const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname + '/db/postcodes.db');

const requiredPostcodeColumns = 'areaName, address3, postcode';
const requiredCountryColumns = 'countryName, PostcodeTranslation';

function DB (action, query) {
    return new Promise(function (resolve, reject) {
        db[action](query, (err, rows) => {
            if (err) reject(err);

            if (rows) {
                resolve(rows);
            } else {
                reject('Couldnt find anything with that name :(')
            }

        })
    })
}

module.exports = {
    /* Example:
     * DB_ACTIONS.findByCity(countryCode, _.startCase(req.params.city));
     * */
    findByCity: (countryCode, city) => {
        return DB('get', `SELECT ${requiredPostcodeColumns} FROM Postcode WHERE areaname="${city}" COLLATE NOCASE`);
    },
    /* Example:
     * DB_ACTIONS.findByPostcode(countryCode, '10290');
     * */
    findByPostcode: (countryCode, postcode) => {
        return DB('get', `SELECT ${requiredPostcodeColumns} FROM ${countryCode.toUpperCase()} WHERE postalcode="${postcode}"`);
    },
    getFirstCityName: (countryCode) => {
        return DB('all', `SELECT areaname FROM Postcode WHERE countryCode1="${countryCode.toUpperCase()}" ORDER BY areaname ASC LIMIT 1`);
    },
    getCities: (countryCode) => {
        return DB('all', `SELECT ${requiredPostcodeColumns} FROM Postcode WHERE countryCode1="${countryCode.toUpperCase()}"`);
    },
    getCountry: (countryCode) => {
        return DB('all', `SELECT ${requiredCountryColumns} FROM Country WHERE countryCode1="${countryCode.toUpperCase()}"`);
    }
};