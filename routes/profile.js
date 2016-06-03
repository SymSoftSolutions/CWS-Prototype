'use strict';

var roles = require('../models/tables').roles;
var utils = require('../lib/utils');
var config = require('../config');
var dbUtils = require('../lib/dbUtils');
var permission = require('permission');
var multer = require('multer')
var upload = multer()

var path = require('path')
var fs = require("fs");
/**
 * The primary export for this file, the init function will set a number of routes required for
 * implementing a user profile page and supporting C.R.U.D. functionality.
 *
 * @function {init} - initializes profile page server-side routing
 */
exports.init = init;

function init(router) {

    // All of our profile page routes are accessible only by users with the
    // role of fosterParent or caseWorker, and only after successful permissions will the user object
    // be available to the views.
    router.use(permission(Object.keys(roles).map(function(key){return roles[key]})));
    // All views get a res.locals.user object set
    router.use(setUser);


    /**
     * The primary profile route shows basic profile information for users
     */
    router.get('/profile', function (req, res) {
        if(req.user.role == roles.caseWorker){
            res.render('caseworker-profile');
        }
        if(req.user.role == roles.fosterParent){
            res.render('profile');
        }
    });


    /**
     * The
     */
    router.post('/update/', function (req, res) {
        console.dir(req.body, {depth:null, colors: true})

        req.session.adultcount = 0;
        req.session.childcount = 0
        dbUtils.updateUserDetails(req.user, req.body ).then(function(){
            res.redirect('/profile');
        });

    });


    router.get('/add/adults', function(req, res){
        var n = req.session.adultcount || 0
        req.session.adultcount = ++n
        res.locals.index = req.session.adultcount;
          console.log(res.locals.index)
        res.render('partials/profile/adults', {layout: false});
    })

    router.get('/add/children', function(req, res){
        var n = req.session.childcount || 0
        req.session.childcount = ++n
        res.locals.index = req.session.childcount;
        console.log(res.locals.index)
        res.render('partials/profile/children', {layout: false});
    })

    router.post('/update/:prop', function(req, res){
        console.log(req.params.prop);

    })


    router.post('/avatar', upload.single(), function (req, res) {

        // png data uri
        var avatarData = req.body.avatar;
       dbUtils.updateUserAvatar(req.user, avatarData).then(function(){
           res.redirect('/profile');
       }).catch(function (e) {
          throw e;
       });

    });

    router.delete('/avatar', function (req, res) {
        dbUtils.deleteUserAvatar(req.user).then(function () {
            res.redirect('/profile');
        }).catch(function (e) {
           throw e;
        });
    });
}

/**
 * Small middleware for setting the user object to be visible in our handlebars layouts
 * Its side effect is a `res.locals.user` variable being set.
 */
function setUser(req, res, next) {
    if (req.user) {
        res.locals.user = req.user;
    }
    next();
};


function checkNested(obj /*, level1, level2, ... levelN*/) {
    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < args.length; i++) {
        if (!obj || !obj.hasOwnProperty(args[i])) {
            return false;
        }
        obj = obj[args[i]];
    }
    return true;
}

