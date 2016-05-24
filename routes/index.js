'use strict';

var utils = require('../lib/utils');
var exports = module.exports = utils.requireDir(__dirname);

exports.render   = render;
exports.redirect = redirect;

// -----------------------------------------------------------------------------

function render(viewName, layoutPath) {
    return function (req, res) {
        if (layoutPath) {
            res.locals.layout = layoutPath;
        }
        if(req.user){
            res.locals.user = req.user
        }
       console.log(req.session.passport);
        res.render(viewName);
    };
}

function redirect(url, status) {
    return function (req, res) {
        res.redirect(status || 302, url);
    };
}