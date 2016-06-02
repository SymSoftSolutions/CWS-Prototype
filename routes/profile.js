'use strict';

var utils = require('../lib/utils');
var config = require('../config');
var dbUtils = require('../lib/dbUtils');
var permission = require('permission');
var path = require('path')
var multer = require('multer')
var storage = multer.diskStorage({
    destination: config.dirs.avatars,
    filename: function (req, file, cb) {
        cb(null, createName(file))
    }
});

var upload = multer({
    storage: storage, limits: {
        fileSize: 2000000,
        files: 1
    }
}).single('avatar')

/**
 * The primary export for this file, the init function will set a number of routes required for
 * implementing a user profile page and supporting C.R.U.D. functionality.
 *
 * @function {init} - initializes profile page server-side routing
 */
exports.init = init;


function createName(file) {
    return file.fieldname + '-' + Date.now() + file.mimetype;
}

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
    })


    router.post('/avatar',  function (req, res) {
        upload(req, res, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            if(!req.file){
                return
            }
            dbUtils.updateUserAvater(req.user, req.file.filename).then(function(){
            }).catch(function(e){
                res.status(500).send('DB insert of avatar broke');
            })
        })
        res.redirect('/profile');

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