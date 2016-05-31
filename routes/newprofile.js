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

        dbUtils.listTableColumns('users').then((data) => {
            console.log(data);
            res.render('forms/newprofile');
        });
    });


    /**
     * Take user details, and if all entered in properly save user to the database.
     * If something goes wrong we redirect back to the forms to try again, but with a message to the user too.
     */
    router.post('/newprofile', function newProfileSave(req, res, next) {
        // Check if required fields exist

        // Check if email is already in system

        // If all good, insert user into db, then redirect to profile page


        // dbUtils.listTableColumns('users').then((data) => {
        //     res.render('501', {status: 501, url: req.url});
        // });
    });
}
