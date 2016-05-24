// Setting up the connection to the postgres database
var db = require('./db');

exports.userCheck = userCheck;
exports.deserializeUser = deserializeUser;

function userCheck(checkName, password, cb) {
    return db.select().where('email', checkName).from('users').then(function (rows) {

        // no user found
        if (rows.rowCount == 0) {
           return cb(null, false);
        }

        // password mismatch
        if (rows[0].password != password) {
            return cb(null, false);
        }

        // return our user object
        return cb(null, rows[0]);
    }).catch(function (e) {
        // Finally, add a .catch handler for the promise chain
        return cb(e);
    });
}

function deserializeUser(id, cb) {
    return db.select().where('userID', id).from('users').then(function (rows) {
        console.log(rows);
        // no user found
        if (rows.rowCount == 0) {
           return cb(null, false);
        }
        // return our user object
        return cb(null, rows[0]);
    }).catch(function (e) {
        // Finally, add a .catch handler for the promise chain
       return cb(e);
    });
}

