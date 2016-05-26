'use strict';

var utils = require('../lib/utils');
var exports = module.exports = utils.requireDir(__dirname);

exports.render = render;
exports.redirect = redirect;
exports.checkAuth = checkAuth;

// -----------------------------------------------------------------------------

function render(viewName, layoutPath) {
    return function (req, res) {

        // add our user object
        if (req.user) {
            res.locals.user = req.user
        }
        // add our flash messages
        res.locals.messages = req.flash();
        console.log(res.locals.messages);
        res.render(viewName);
    };
}

function redirect(url, status) {
    return function (req, res) {
        res.redirect(status || 302, url);
    };
}
