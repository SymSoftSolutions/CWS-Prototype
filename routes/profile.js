'use strict';

var roles = require('../models/tables').roles;
var utils = require('../lib/utils');
var config = require('../config');
var dbUtils = require('../lib/dbUtils');
var permission = require('permission');

/**
 * The primary export for this file, the init function will set a number of routes required for
 * implementing a user profile page and supporting C.R.U.D. functionality.
 *
 * @function {init} - initializes profile page server-side routing
 */
exports.init = init;

function init(router){

    // All of our profile page routes are accessible only by users with the
    // role of `fosterParent`, only after successful permissions will the user object
    // be available to the views.
    router.use(permission(Object.keys(roles).map(function(key){return roles[key]})));
    router.use(setUser);


    router.get('/profile', function (req, res) {
        if(req.user.role == roles.caseWorker){
            res.render('caseworker-profile');
        }
        if(req.user.role == roles.fosterParent){
            res.render('profile');
        }

    });

    router.post('/updateprofile', function(req, res){
           console.log(req.body)
    })
}

/**
 * Small middleware for setting the user object to be visible in our handlebars layouts
 * Its side effect is a `res.locals.user` variable being set.
 */
function setUser(req, res, next) {
    if (req.user) {
        res.locals.user = req.user
    }
    next();
};