'use strict';

var utils = require('../lib/utils');
var config = require('../config');
var dbUtils = require('../lib/dbUtils');
var exports = module.exports = utils.requireDir(__dirname);

// var middleware = require('../middleware');

var passport = require('passport');
var permission = require('permission');

// Domain Specific Routes
var newProfileRoutes = require('./newprofile');
var profileRoutes = require('./profile');
var messagingRoutes = require('./privatemessage');
var dbCalls = require('./dbCalls');
var inboxRoutes = require('./inbox');

var https = require('https');
var querystring = require('querystring');

exports.createAllRoutes = createAllRoutes;
exports.createErrorHandling = createErrorHandling;

function createAllRoutes(router) {

    router.get('/', render('home'));

    router.get('/login', redirectToProfile, render('login'));


    router.post('/auth', passport.authenticate('local', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));



    router.get('/logout',
        function (req, res) {
            req.logout();
            res.redirect('/');
        });


    router.get('/about', render('about'));

    router.get('/geolookup', function(req,res){

        var zip = req.query.zip;
        var APIEndpoint = "https://www.googleapis.com/fusiontables/v1/query?";
        var sql = "SELECT CITY, ZIP_CODE, REGION, LATITUDE, LONGITUDE FROM  149YUn9FJFchbeDd25r5Ge-vTl4_AD5dfTx31R-Od  WHERE ZIP_CODE = '" + zip + "' LIMIT 1"

         var url = APIEndpoint + "sql=" + querystring.escape(sql) + "&key=" +  config.strings.googlekey;

        console.log(url);
        https.get(url, function(res2) {
            var body = '';
            res2.on('data', function(chunk) {
                body += chunk;
            });
            res2.on('end', function() {
                try {
                    var json = JSON.parse(body);
                    var lat = json.rows[0][3];
                    var lng = json.rows[0][4];
                    res.json({lat: lat, lng: lng});
                } catch(e) {
                    res.status(500).send({ error: e });
                }

            });


        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });

    })


    newProfileRoutes.createNewProfiles(router);
    messagingRoutes.init(router);
    profileRoutes.init(router);
    inboxRoutes.init(router);
    dbCalls.init(router);

}

function redirectToProfile(req, res, next) {
    if (req.user) {
        res.redirect('/profile');
    } else {
        next();
    }
}

function createErrorHandling(router) {

    router.get('/public*', function(req,res,next){
        res.sendStatus(404).end();
        return;
    });

    // Error handling middleware
    router.use(function (req, res, next) {

        // respond with html page
        if (req.accepts('text/html')) {
            res.render('404', { url: req.url });
            return;
        }

        // respond with json
        if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
        }

    });

    router.use(function (err, req, res, next) {

        res.render('500', {
            status: err.status || 500,
            error: err,
            stack: err.stack
        });
    });

}

// -----------------------------------------------------------------------------

function render(viewName) {
    return function (req, res) {
        // add our user object
        if (req.user) {
            res.locals.user = req.user
        }
        res.render(viewName, {
            title: viewName
        });
    };
}

function redirect(url, status) {
    return function (req, res) {
        res.redirect(status || 302, url);
    };
}
