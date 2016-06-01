'use strict';

var utils = require('../lib/utils');
var config = require('../config');
var dbUtils = require('../lib/dbUtils');
var permission = require('permission');

exports.init = init;

function init(router){

    //
    router.use(permission('fosterParent'));
    router.use(setUser);
    router.get('/info',  function (req, res) {
        // add our user object
        if (req.user) {
            res.locals.user = req.user
        }
        res.render('');
    });
}

function setUser(req, res, next) {
    if (req.user) {
        res.locals.user = req.user
    }
    next();
};