var roles = require('../models/tables').roles;
var utils = require('../lib/utils');
var config = require('../config');
var dbUtils = require('../lib/dbUtils');
var middleware = require('../middleware');

var passport = require('passport');
var permission = require('permission');


exports.init = init;

/**
 * Adds routes for handling user sent messages
 * @param router
 */
function init(router) {

    // All of our messaging routes are accessible only by users with the
    // role of fosterParent or caseWorker, and only after successful permissions will the user object
    // be available to the views.
    router.use(permission(Object.keys(roles).map(function(key){return roles[key]})));
    // All views get a res.locals.user object set
    router.use(setUser);

    /**
     * Take user details, and if all entered in properly save user to the database.
     * If something goes wrong we redirect back to the forms to try again, but with a message to the user too.
     */
    router.post('/message', function(req, res, next) {
        if(req.user && req.isAuthenticated()) {
            /**
             * Form must contain following components:
             * subject      IN message.subject
             * message text IN message.text
             * recipient    IN message.recipientID
             */
            var message = {};
            message['fromID']       = req.user.userID;
            message['subject']      = req.body.subject;
            message['message']      = req.body.text;
            message['hasRead']      = false;

            var recipientField = req.body.recipientID;
            var isRecipientNumeric = isNaN(recipientField);

            if(!(isRecipientNumeric)) {
                // If we are given the numerical ID of recipient, send directly
                message['recipientID']  = parseInt(recipientField);
                processMessage(message, req, res);
            } else {
                // If not, lookup by email
                if(recipientField) {
                    dbUtils.retrieveUser({'email':recipientField}).then(function(user) {
                        var recipientID = user.userID;
                        message['recipientID'] = recipientID;

                        processMessage(message, req, res);
                    }).catch(function(err) {
                        message['recipientID'] = null;
                        processMessage(message, req, res);
                    });
                } else {
                    // No unique identifier
                    message['recipientID'] = null;
                    processMessage(message, req, res);
                }
            }

        }
        else {
            res.render('501', {status: 501, url: req.url});
        }
    });


}

function processMessage(message, req, res) {
    //Makes sure all fields exist
    var allFieldsExist = false;
    if(message['subject']       != null &&
       message['message']       != null &&
       message['recipientID']   != null) {
       allFieldsExist=true;
    } else {
        if(message['recipientID'] == null) {
            req.flash('error', 'Invalid recipient!');
        }
        if(!allFieldsExist) {
            req.flash('error', 'Required fields not filled');
        }
        req.flash('success', 'Message sent!');
        res.redirect('/inbox');
        return;
    }

    dbUtils.checkExist('users', {'userID': message['recipientID']}, function(err, recipientExists) {

        if(err) {
            res.render('501', {status: 501, url: req.url});
            return;
        }
        if(recipientExists && allFieldsExist) {
            dbUtils.addMessage(message).then(function() {
                res.send({'status':'success'});
            });
        } else {
            req.flash('error', 'Please enter a valid recipient');
            res.send({'status':'error'});
        }
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
