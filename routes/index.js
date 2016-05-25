'use strict';

var utils = require('../lib/utils');
var exports = module.exports = utils.requireDir(__dirname);

exports.render = render;
exports.redirect = redirect;
exports.checkAuth = checkAuth;

// -----------------------------------------------------------------------------

function render(viewName, layoutPath) {
    return function (req, res) {
        if (layoutPath) {
            res.locals.layout = layoutPath;
        }
        if (req.user) {
            res.locals.user = req.user
        }
        res.render(viewName);
    };
}

function redirect(url, status) {
    return function (req, res) {
        res.redirect(status || 302, url);
    };
}


function checkAuth(req, res, next) {
    // Set through Passport lib
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        // Force user to login, and then Passport will return to the previous page
        req.session.returnTo = req.url;
        res.redirect('/login');
    }

}