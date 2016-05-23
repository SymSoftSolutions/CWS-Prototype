/*
   Configuration for paths, and other common configurables
 */
'use strict';

var path = require('path');
module.exports = {
    strings: {
      token: 'testing'
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