var utils = require('../lib/utils');
var config = require('../config');
var dbUtils = require('../lib/dbUtils');
var middleware = require('../middleware');

var passport = require('passport');
var permission = require('permission');


exports.processMessages = processMessages;
exports.getMessageData = getMessageData;

/**
 * Adds routes for handling user sent messages
 * @param router
 */
function processMessages(router) {

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
            message['recipientID']  = parseInt(req.body.recipientID);
            message['message']      = req.body.text;
            message['hasRead']      = false;

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
        else {
            res.render('501', {status: 501, url: req.url});
        }
    });
}

function getMessageData(router) {
    /**
     * Gets message list for a specified user either sending or recieving messages
     * Takes JSON request only
     * Client should post JSON containing user's ID
     */
     router.post('/getMessages', function(req, res) {
        //var byRecipient = req.body.bySender; //If false, assumed to be asking for emails by sender - ones that were send by user
        var byRecipient = true;
        var userID = req.user.userID;

        if(byRecipient) {
            dbUtils.getRecievedMessages(userID).then(function(messageList) {
                console.log('recieved request');
                messageList = formatMessageData(messageList);
                res.send(messageList);
            });
        } else {
            dbUtils.getUserMessages(userID).then(function(messageList) {
                messageList = formatMessageData(messageList);
                res.send(messageList);
            });
        }

     });
     
     /**
      * Gets address 
      *
      */
     router.post('/getRelevantAddresses', function(req, res) {
     });
}

function formatMessageData(messageList) {
    var newList = [];
    for(var index in messageList) {
        var message = messageList[index];
        var column_array =[message.fromID, message.subject, message.body, message.createdAt];
        newList.push(column_array);
        console.log(message);
    }
    
    console.log(newList);
    return {"data": newList};
}