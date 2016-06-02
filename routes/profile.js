'use strict';

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
    // role of `fosterParent`, only after successful permissions will the user object
    // be available to the views.
    router.use(permission('fosterParent'));
    router.use(setUser);


    router.get('/profile', function (req, res) {
        console.log(res.locals.user)
        res.render('profile');
    });

    router.post('/updateprofile', function (req, res) {
        console.log(req.body)
    });


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
        res.locals.user = req.user
    }
    next();
};