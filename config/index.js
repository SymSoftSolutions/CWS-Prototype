/*
   Configuration for paths, and other common configurables
 */

var path = require('path');
module.exports = {
    strings: {
      token: 'testing'
    },
    server: {
        port: 8000
    },
    // TODO: parse these out from environment variables
    postgres: {
        host: "localhost",
        port: "5432",
        database: "cws",
        user:"postgres",
        password: "echopostgres"
    },
    dirs: {
        pub     : path.resolve('public/'),
        bower   : path.resolve('bower_components/'),
        views   : path.resolve('views/'),
        layouts : path.resolve('views/layouts/'),
        partials: path.resolve('views/partials/'),
        shared  : path.resolve('shared/templates/')
    }
};