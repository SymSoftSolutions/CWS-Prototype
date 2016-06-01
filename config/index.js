/**
 * General App Configuration
 */

var path = require('path');

module.exports = {

  /**
   * Primary server related configuration
   */
  server: {
    port: 8000
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
   * TODO: Logging
   */
  logging: {},

  /**
   * File and folder structure specifics
   */
  dirs: {
    pub: 'public',
    bower: path.resolve('bower_components/'),
    views: path.resolve('views/'),
    layouts: path.resolve('views/layouts/'),
    partials: path.resolve('views/partials/'),
    shared: path.resolve('shared/templates/')
  },

  /**
   * Commonly used strings for various aspects of middleware and other app functionality
   */
  strings: {
    token: 'testing'
  }
};