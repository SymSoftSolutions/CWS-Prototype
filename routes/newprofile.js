var utils = require('../lib/utils');
var config = require('../config');
var dbUtils = require('../lib/dbUtils');

exports.checkAllFieldsExist = checkAllFieldsExist;

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
        respondToFormRequest(req, rest, next)
    });
}

function checkAllFieldsExist(body) {
        // Check if required fields exist
        if(body.firstName == '' || !(body.firstName) ||
           body.lastName  == '' || !(body.lastName)
          ) {
            return false;
        }

        if(body.password == '' || !(body.password)
        ) {
            return false;
        } else {
            if(body.confirmPassword == '' || !(body.confirmPassword)
            ) {
                return false
            } else {
                // Check that passwords match
                passwordsMatch = (body.password == body.confirmPassword);
            }
        }
        return passwordsMatch;
}

function respondToFormRequest(req, res, next) {
        emailValid = true;
        passwordsMatch = true;
        allFieldsExist = checkAllFieldsExist(req.body);

            if(req.body.email != null) {
                // Check if email is already in system - requires callback function;
                dbUtils.checkExist('users', {'email': req.body.email}, function(err, emailExists) {
                    if(err) {
                        console.log(err);
                        res.render('501', {status: 501, url: req.url});
                    } else {
                        var formIsValid = allFieldsExist && (!emailExists) && passwordsMatch;
                        if(emailExists) {
                            console.log('email is taken');
                            req.flash('error', 'Email is already registered');
                        }
                        if(!allFieldsExist) {
                            console.log('some fields don\'t exist');
                            req.flash('error', 'Required fields not filled');
                        }
                        if(!passwordsMatch) {
                            console.log('passwords don\'t match');
                            req.flash('error', 'Password confirmation does not match password');
                        }
                        respondToNewUser(formIsValid, req, res, next);
                    }
                });
            }
}

function respondToNewUser(formIsValid, req, res, next) {
        // If all good, insert user into db, then redirect to profile page
        if(formIsValid) {
            console.log('form is valid');
            var user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                role: 'fosterParent'
            }
            user['role'] = 'fosterParent';
            console.log(user);
            
            dbUtils.insertUser(user, function(err) {
                console.log('error occured');
                console.log(err);
            });
            res.redirect('/login');
        } else {
            console.log('form is invalid');
            res.redirect('/newprofile');
        }
}
