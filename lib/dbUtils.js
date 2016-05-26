// Setting up the connection to the postgres database
var db = require('./db');
// for our password hashing
var bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;

exports.userCheck = userCheck;
exports.deserializeUser = deserializeUser;
exports.insertUser = insertUser;

/**
 * For logging of particular interesting queries for analytics, performance, etc
 * TODO: Implement with actual logger
 * @user msg
 */
function logBusinessRequest(businessName) {
    return function (data) {
        console.log(businessName, data)
    }

}

/**
 * Inserts a user object into our db
 * @param user
 * @returns {Promise}
 */
function insertUser(user) {

    var hash = bcrypt.hashSync(user.password)
    // Store hashed pass
    user.password = hash;
    return db.insert(user).into('users')

}

function userCheck(checkName, password, cb) {
    return db.select().where('email', checkName).from('users').then(function (rows) {

        // no user found
        if (rows.rowCount == 0) {
            return cb(null, false);
        }

        var hash = rows[0].password;

        // check for password mismatch
        bcrypt.compare(password, hash, function (err, res) {
            if (res) {
                // return our user object
                return cb(null, rows[0]);
            } else {
                return cb(null, false);
            }
        });

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

/**
 * Gets a users cases
 * @user id
 * @return Promise with array of cases, if any
 */
function getCaseWorkerCases(id) {
    return db.select().from('cases').where('caseWorker', id).on('query-response', logBusinessRequest(getCaseWorkerCases.name))
}

/**
 * Gets a users cases
 * @user id
 * @return Promise with array of cases, if any
 */
function getFosterParentCases(id) {
    return db.select().from('cases').where('fosterParent', id).on('query-response', logBusinessRequest(getCaseWorkerCases.name))
}


function getUserMessages(id) {
    return db.select().from('messages').where('fromID', id);
}

function getMessagesPerCase(caseID) {
    return db.select().from('messages').where('caseID', caseID);
}

/**
 * TODO
 * @user id
 * @returns {string}
 */
function getFosterParentsInContactWith(caseWorkerID) {
    // any messages which this case worker is in contact with
    db.select().from('messages').where('fromPersonID', caseWorkerID).orWhere('toPersonID', caseWorkerID);

    return db.select().from('users').join('')
}


