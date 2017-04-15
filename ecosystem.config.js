module.exports = {
    apps: [{
        name: 'postcode',
        script: './server.js'
    }],
    deploy: {
        production: {
            user: 'ubuntu',
            host: '52.221.155.144',
            key: '~/.ssh/GiffMeAkces.pem',
            ref: 'origin/master',
            repo: 'git@github.com:IshanRatnapala/postcodr.git',
            path: '/home/postcode-server/',
            'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
        }
    }
};