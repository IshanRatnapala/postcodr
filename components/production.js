const compression = require('compression');
const minifyHTML = require('express-minify-html');
const assetManager = require('connect-assetmanager');
const assetHandler = require('connect-assetmanager-handlers-updated');

const assetManagerGroups = {
    'js': {
        'route': /\/public\/js\/scripts\.min\.js/,
        'path': './client/js/',
        'dataType': 'javascript',
        'files': [
            'jquery.min.js',
            'lodash.min.js',
            'jquery.autocompletr.js',
            'app.js'
        ],
        'preManipulate': {
            '^': [
                assetHandler.uglifyJsOptimize
            ]
        }
    },
    'css': {
        'route': /\/public\/css\/styles\.min\.css/,
        'path': './client/css/',
        'dataType': 'css',
        'files': [
            'jquery.autocompletr.css',
            'styles.css'
        ]
    }
};

module.exports = function (app) {

    app.use(minifyHTML({
        override:      true,
        exception_url: false,
        htmlMinifier: {
            removeComments:            true,
            collapseWhitespace:        true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes:     true,
            removeEmptyAttributes:     true,
            minifyJS:                  true
        }
    }));
    app.use(compression());
    app.use(assetManager(assetManagerGroups));
};