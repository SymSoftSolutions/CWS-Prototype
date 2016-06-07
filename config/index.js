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
    host: "ec2-184-73-196-82.compute-1.amazonaws.com",
    port: "5432",
    database: "d2vevrt3cr7djr",
    user: "wbddazumodfpjd",
    password: "IQXZ-7AoOwyS1r1e2z7y4kgqu3"
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
    shared: path.resolve('shared/templates/'),
    avatars: path.resolve('public','avatars')
  },

  /**
   * Commonly used strings for various aspects of middleware and other app functionality
   */
  strings: {
    token: 'testing'
  }
};
