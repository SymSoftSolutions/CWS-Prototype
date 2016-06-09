/**
 * General App Configuration
 */

var path = require('path');
// if(app.get('env')
// )
module.exports = {

  /**
   * Primary server related configuration
   */
  server: {
    port: process.env.PORT || 8000
  },

  /**
   * Data base and persistence specifics
   */
  postgres: {
    host: "localhost",
    port: "5432",
    database: "cws",
    user: "postgres",
    password: "echopostgres"
  },

  /**
   * TODO: Logging based on deployment config
   */
  logging: {
    folder: path.resolve('logs')

  },

  /**
   * File and folder structure specifics
   */
  dirs: {
    pub: 'public',
    bower: path.resolve('bower_components'),
    views: path.resolve('views'),
    layouts: path.resolve('views','layouts'),
    partials: path.resolve('views','partials'),
    shared: path.resolve('shared','templates'),
    avatars: path.resolve('public','avatars')
  },

  /**
   * Commonly used strings for various aspects of middleware and other app functionality
   */
  strings: {
    token: process.env.SESSION_TOKEN || 'testing',
    googlekey: process.env.GOOGLE_KEY || ''
  }
};


/*
 * Override our postgres defaults for our different deployments
 */

if(process.env.NODE_ENV == 'staging'){
  module.exports.postgres = {
    host: "localhost",
    port: "5432",
    database: "cwsprototype",
    user:"cwsprototype",
    password: "symsoft01"
  }
}


if(process.env.NODE_ENV == "production") {
  module.exports.postgres = {
    host: process.env.RDS_HOSTNAME,
    database: process.env.RDS_DB_NAME,
    user: process.env.RDS_USERNAME,
    password:  process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
  }

}
