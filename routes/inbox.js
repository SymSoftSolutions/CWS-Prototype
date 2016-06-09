'use strict';

var utils = require('../lib/utils');
var config = require('../config');
var dbUtils = require('../lib/dbUtils');
var permission = require('permission');
var roles = require('../models/tables').roles;

/**
 * The primary export for this file, the init function will set a number of routes required for
 * implementing a user inbox page.
 *
 * @function {init} - initializes inbox page server-side routing
 */
exports.init = init;

function init(router){

    // All of our profile page routes are accessible only by users with the
    // role of fosterParent or caseWorker, and only after successful permissions will the user object
    // be available to the views.
    router.use(permission(Object.keys(roles).map(function(key){return roles[key]})));
    router.use(setUser);

    router.get('/inbox',  function (req, res) {
        res.expose(true, 'inbox', {cache:true});
        res.render('inbox');
    });
    
    /**
     * Gets message list for a specified user either sending or recieving messages
     * Takes JSON request only
     * Client should post JSON containing user's ID
     */
     router.post('/getMessages', function(req, res) {
        //var byRecipient = req.body.bySender; //If false, assumed to be asking for emails by sender - ones that were send by user
        var userID = req.user.userID;

        dbUtils.getRecievedMessages(userID).then(function(messageList) {
            messageList = formatMessageData(messageList);
            res.send(messageList);
        });

     });

     router.post('/sendMessages', function(req, res) {
        var userID = req.user.userID;

        dbUtils.getUserMessages(userID).then(function(messageList) {
            messageList = formatMessageData(messageList);
            res.send(messageList);
        });
     });

     router.post('/deleteMessage', function(req, res, next) {
        var messageID = req.body.messageID;
        dbUtils.deleteMessage(messageID).then(function() {
            res.send({'status':'success'});
        }).catch(function(err) {
            res.send({'status':'error', 'message':err});
        });
     });


    /**
     * Lists the relevant users for sending messages
     */
    router.get('/relevantusers', function(req, res){
        var promise;
        switch (req.user.role){
            case roles.caseWorker:
                promise = dbUtils.getAllFosterParents();
                break;
            case roles.fosterParent:
                promise = dbUtils.getAllCaseWorkersForFosterParent();
                break;
            // TODO: More cases for specific or filtered users
            default:
                promise = dbUtils.getAllUsers();
        }
        return promise.then(function(users){
            res.json(users);
        })
    });
}

/**
 * Takes message list and formats it in friendlier form to display on front-end
 * @param messageList - array of messages in JSON, same as rows
 */
function formatMessageData(messageList) {
    var newList = [];

    for(var index in messageList) {
        var message = messageList[index];
        var column_array =[message.fromID, message.subject, message.message, message.createdAt, message, message.messageID];
        newList.push(column_array);
    }
    
    return {"data": newList};
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
}
