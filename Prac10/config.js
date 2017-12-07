var config = { };

config.rootURL = 'localhost:3000/'

config.sessionSecret = 'jjdjfkd335kjhlj353j5'

config.facebook = {
    appId:   '1553870174836555',
    appSecret: 'fbb48f60a861749a757e088cfed397a8',
    redirectUri: config.rootURL + 'auth/'
};

config.db = {
    host: 'localhost',
    user: '',
    password: '',
    database: 'ff'
}

module.exports = config;
