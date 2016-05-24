var config = require('../config');
var knex = require('knex')({
    client: 'postgresql',
    connection: {
        host: config.postgres.host,
        user: config.postgres.user,
        password: config.postgres.password,
        database: config.postgres.database
    }
});

module.exports = knex;
