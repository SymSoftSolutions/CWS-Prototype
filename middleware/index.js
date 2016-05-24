'use strict';

var utils = require('../lib/utils');
var exports = module.exports = utils.requireDir(__dirname);

exports.logger = require('morgan');
exports.slash  = require('express-slash');