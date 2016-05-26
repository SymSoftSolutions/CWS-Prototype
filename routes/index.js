'use strict';

var utils = require('../lib/utils');
var exports = module.exports = utils.requireDir(__dirname);
// var middleware = require('../middleware');

var passport = require('passport');
var permission = require('permission');

exports.render = render;
exports.redirect = redirect;

exports.createAllRoutes = createAllRoutes;
exports.createErrorHandling = createErrorHandling;

function createAllRoutes(router){
    
    router.get('/',  render('home'));

    router.get('/login', render('login'));
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    router.get('/profile', permission('fosterParent'), render('profile'));

    router.get('/logout',
        function (req, res) {
            req.logout();
            res.redirect('/');
        });

    // testing session
    router.get('/session', function (req, res) {
        var n = req.session.views || 0
        req.session.views = ++n
        res.end(n + ' views')
    });
}

function createErrorHandling(router){
    // Error handling middleware
    router.use(function (req, res, next) {
        res.render('404', {status: 404, url: req.url});
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
