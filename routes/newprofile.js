var utils = require('../lib/utils');
var config = require('../config');
var dbUtils = require('../lib/dbUtils');

// var middleware = require('../middleware');

var passport = require('passport');
var permission = require('permission');


exports.createNewProfiles = createNewProfiles;

/**
 * Adds routes for handling new user creation
 * @param router
 */
function createNewProfiles(router) {

    /**
     * Present to the user a form for entering in basic user details
     */
    router.get('/newprofile', function newProfileForm(req, res, next) {
        res.render('forms/newprofile');
    });

    /**
     * Take user details, and if all entered in properly save user to the database.
     * If something goes wrong we redirect back to the forms to try again, but with a message to the user too.
     */
    router.post('/newprofile', function newProfileSave(req, res, next) {
        respondToFormRequest(req, res, next)
    });
}

function respondToFormRequest(req, res, next) {
        var body           = req.body;
        var nameExists     = !(body.firstName       == '' || !(body.firstName) ||
                               body.lastName        == '' || !(body.lastName));
        var passwordExists = !(body.password        == '' || !(body.password) ||
                               body.confirmPassword == '' || !(body.confirmPassword));
        var passwordsMatch =  (body.password == body.confirmPassword);

            if(req.body.email != null) {
                // Check if email is already in system - requires callback function;
                dbUtils.checkExist('users', {'email': req.body.email}, function(err, emailExists) {
                    if(err) {
                        console.log(err);
                        res.render('501', {status: 501, url: req.url});
                    } else {
                        var formIsValid = nameExists && passwordExists && (!emailExists) && passwordsMatch;
                        if(emailExists) {
                            req.flash('error', 'Email is already registered.');
                        }
                        if(!nameExists) {
                            req.flash('error', 'Please fill out name.');
                        }
                        if(!passwordExists) {
                            req.flash('error', 'Please fill out password and confirmation.');
                        }
                        if(!passwordsMatch) {
                            req.flash('error', 'Password confirmation does not match password.');
                        }
                        respondToNewUser(formIsValid, req, res, next);
                    }
                });
            }
}
var testCaseWorker = require('../models/createAll').testCaseWorker;
function respondToNewUser(formIsValid, req, res, next) {
        // If all good, insert user into db, then redirect to profile page
        if(formIsValid) {
            var user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                role: 'fosterParent'
            }
            user['role'] = 'fosterParent';
            
            dbUtils.insertUser(user).then(function(userDetails){
               user.userID = userDetails[0].userID;
               return dbUtils.assignCaseWorker(user, testCaseWorker);
            }).then(function() {
                    user.password = req.body.password;
                    req.login(user, function (err) {
                        if ( ! err ){
                            res.redirect('/inbox');
                        } else {
                           console.log(err);
                        }
                    })
                    res.redirect('/login');
            });
        } else {
            res.redirect('/newprofile');
        }
}
