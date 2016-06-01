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
        allFieldsExist = true;
        emailValid = true;
        passwordsMatch = true;

        // Check if required fields exist
        if(req.body.email != null) {
            // Check if email is already in system
            if(dbUtils.checkExist('users', {'email': req.body.email})) {
                emailValid = false;
            }
        } else {
            allFieldsExist = false;
        }

        if(req.body.firstName == null ||
           req.body.lastName  == null
          ) {
            allFieldsExist = false;
        }

        if(req.body.password == null) {
            allFieldsExist = false;
        } else {
            if(req.body.confirmpassword == null) {
                allFieldsExist = false;
            } else {
                passwordsMatch = (req.body.password == req.body.confirmpassword);
            }
        }

        var formIsValid = allFieldsExist && emailValid && passwordsMatch;

        // If all good, insert user into db, then redirect to profile page
        if(formIsValid) {
            console.log('form is valid');
            //TODO: insert logic for placing into database
            var user = req.body;
            user['role'] = 'fosterParent';
            console.log(user);
            
            dbUtils.insertUser(user, function(err) {
            });
            res.render('forms/newprofile');
        }

    });
}
