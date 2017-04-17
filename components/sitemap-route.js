const sm = require('sitemap');

module.exports = function (app) {
    app.get('/sitemap.xml', function (req, res) {
        let sitemap = sm.createSitemap({
            hostname: 'https://postcode.world',
            urls: [{
                url: '/',
                changefreq: 'yearly',
                priority: 0.8
            }]
        });

        sitemap.add({
            url: `https://postcode.world/lk`,
            changefreq: 'yearly',
            priority: 0.9
        });

        DB_ACTIONS.getCities('LK')
            .then((data) => {
                for (var i = 0; i < data.length; i++) {
                    var placename = encodeURIComponent(data[i].placename);
                    sitemap.add({
                        url: `https://postcode.world/lk/${placename}`,
                        changefreq: 'yearly',
                        priority: 1
                    });
                }
                res.header('Content-Type', 'application/xml');
                res.send(sitemap.toString());
            });
    });
};