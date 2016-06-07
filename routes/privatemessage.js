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

    router.get('/sendMessage', function(req, res, next) {
        if(req.isAuthenticated()) {
            res.render('forms/sendmessage');
        }
    });
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

            var recipientEmail =req.body.email;

            if(req.body.recipientID) {
                // If we are given the ID of recipient, send directly
                message['recipientID']  = parseInt(req.body.recipientID);
                processMessage(message);
            } else {
                // If not, lookup by email
                if(recipientEmail) {
                    
                } else {
                    // No unique identifier
                    message['recipientID'] = null;
                    processMessage(message);
                }
            }

        }
        else {
            res.render('501', {status: 501, url: req.url});
        }
    });
}

function processMessage(message) {
    //Makes sure all fields exist
    var allFieldsExist = false;
    if(message['subject']       != null &&
       message['message']       != null &&
       message['recipientID']   != null) {
       allFieldsExist=true;
    } else {
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
                res.redirect('/sendMessage');
            });
        } else {
            req.flash('error', 'Please enter a valid recipient');
            res.redirect('/sendMessage');
        }
            });
}

