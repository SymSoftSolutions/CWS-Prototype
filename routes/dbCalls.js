var utils = require('../lib/utils');
var config = require('../config');
var dbUtils = require('../lib/dbUtils');
var middleware = require('../middleware');

var passport = require('passport');
var permission = require('permission');

exports.init = processDBCalls;
/**
 * Adds routes for handling user sent messages
 * @param router
 */
function processDBCalls(router) {
    router.post('/getUserDetails', function(req, res) {
        if(req.isAuthenticated()) {
            var userID = req.body.userID;
            dbUtils.deserializeUser({}, userID, function(err, principal) {
                var userName = principal.firstName+" "+principal.lastName;
                var userMail = principal.email;

                var userDetails = {"name": userName, "email": userMail, "avatar": principal.avatar};
                res.send(userDetails);
            });
        } else {
            res.send({});
        }
    });
}
