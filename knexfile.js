var config  = require('./config');

module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            host     : config.postgres.host,
            user     : config.postgres.user,
            password : config.postgres.password,
            database : config.postgres.database
        }
    }
}