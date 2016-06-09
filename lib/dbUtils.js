// Setting up the connection to the postgres database
var db = require('./db');
// for our password hashing
var bcrypt = require('bcrypt-nodejs');
var roles = require('../models/tables').roles;
var config = require('../config');
var path = require('path')
var fs = require("fs");
var deepExtend = require('deep-extend');

exports.userCheck = userCheck;
exports.deserializeUser = deserializeUser;

exports.retrieveUser = retrieveUser;
exports.insertUser = insertUser;
exports.removeUser = removeUser;

exports.listTableColumns = listTableColumns;
exports.logQueries = logQueries;
exports.checkExist = checkExist;
exports.addMessage = addMessage;
exports.deleteMessage = deleteMessage;
exports.getUserByID = getUserByID;

exports.getUserMessages = getUserMessages;
exports.getRecievedMessages = getRecievedMessages;

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


function whereUniqueUser(queryBuilder, user) {
    queryBuilder.where('email', user.email)
}

function addMessage(message) {
    return db.insert(message).into('messages');
}


function deleteMessage(messageID) {
   return  db.select().where('messageID', messageID).from('messages')
             .del();
}

function getUserMessages(id) {
    return db.select().from('messages').where('fromID', id);
}

function getRecievedMessages(id) {
    return db.select().from('messages').where('recipientID', id);
}

function getUserByID(userID) {
    return db.select().where('userID', userID)
               .from('users');
}

/**
 * Inserts a user object into our db
 * @param user
 * @returns {Promise}
 */
function insertUser(user) {
    // Store hashed pass
    user.password = bcrypt.hashSync(user.password);
    return db.insert(user).into('users').returning(['userID', 'email']);
}


function retrieveUser(user) {
    return db.first('userID', 'email', 'firstName', 'lastName','avatar','userDetails', 'role')
                .modify(whereUniqueUser, user).from('users');
}


function removeUser(user) {
    return db.from('users').modify(whereUniqueUser, user).del();
}


exports.getAllUsers = function(){
    return db.select('email').from('users');
}

exports.getAllFosterParents = function(){
    return db.select('email').from('users').where('role', roles.fosterParent);
}

exports.getAllCaseWorkersForFosterParent = function(fosterParent){
    return db.select('email').from('users').where('role', roles.caseWorker);
    // return db('users')
    //     .join('cases','users.userID', 'cases.fosterParent')
    //     .select('users.userID', 'users.email', 'cases.fosterParent')
    //     .where('role', roles.caseWorker)
    //     .andWhere(whereUniqueUser, fosterParent)
}

exports.assignCaseWorker = function (oldUser, caseWorker){
    return Promise.all([retrieveUser(oldUser), retrieveUser(caseWorker)])
        .then(function(userObjects){
            var user = userObjects[0];
            var caseWorker = userObjects[1];

            var caseRow = {
                caseWorkers: [caseWorker.userID],
                fosterParent: user.userID
            }
            console.log(caseRow);
            return db.insert(caseRow).into('cases').returning(['caseID']).catch(function(e){
                console.error(e);
            })
        })
}


exports.getUserCaseWorker = function(user){

    function getUserCases(){
        return db.first("fosterParent", "caseWorkers").from('cases').where('fosterParent', user.userID);
    }

     function getCaseWorker(caseObject){
        return  db.first("firstName", "lastName").from('users').whereIn('userID', caseObject.caseWorkers);
     }

    return getUserCases().then(getCaseWorker)

}


/**
 * Given a table name and a object, this function will filter out any properties not
 * given as table columns. Can also pass an optional filter to further reduce the allowed
 * list of properties to update
 * @param table
 * @param updatedObject
 * @param extraFilter -
 * @returns {Promise.<TResult>}
 */
function sanitizeUpdateObjects(table, updatedObject, extraFilter) {
    return listTableColumns(table).then(function (cols) {
        var columnNames = cols.map(function (col) {
            return col.column_name;
        });
        if (extraFilter !== undefined) {
            columnNames = columnNames.filter(extraFilter);
        }
        // using only the column names create a sanitized user object
        var sanitizedObject = {};
        columnNames.forEach(function (col) {
            // copy the column over
            if(updatedObject[col] !== undefined){
                sanitizedObject[col] = updatedObject[col]
            }
        });
        return Promise.resolve(sanitizedObject);
    })
}

/**
 * Updates and merges a user's general user details
 * It is assumed that the user object has atleast its identifying value se.
 * If the updatedUser has properties not set as columns in the users table, these will be merged into
 * the userDetails object
 * @param {Object} user - user object, must have a userID
 * @returns {Promise.<TResult>}
 * @param updatedUser
 */
exports.updateUserDetails = function updateUserDetails(oldUser, updatedUser) {

    // filter, retrieve old, then update, then commit transaction
    function transact(trx) {
        return Promise.all([sanitizeUpdateObjects('users', updatedUser, filterNonModifyAbleColumns), retrieveUser(oldUser)])
          .then(function (results) {
              var sanitizedUpdates = results[0];
              var completeOldUser = results[1];
              // merge our old json data first
              var modifiedUser = deepExtend(completeOldUser, sanitizedUpdates);
              // then update the whole user object
              return db.from('users').modify(whereUniqueUser, completeOldUser).update(modifiedUser);
          })
          .then(trx.commit)
          .catch(trx.rollback);
    }

    return db.transaction(transact);
}

exports.replaceUserDetails = function updateUserDetails(oldUser, updatedUser) {

    // filter, retrieve old, then update, then commit transaction
    function transact(trx) {
        return Promise.all([sanitizeUpdateObjects('users', updatedUser, filterNonModifyAbleColumns), retrieveUser(oldUser)])
            .then(function (results) {
                var sanitizedUpdates = results[0];
                var completeOldUser = results[1];
                var modifiedUser = completeOldUser;
                modifiedUser.userDetails = sanitizedUpdates.userDetails;
                // then update the whole user object
                return db.from('users').modify(whereUniqueUser, completeOldUser).update(modifiedUser);
            })
            .then(trx.commit)
            .catch(trx.rollback);
    }

    return db.transaction(transact);
}


function filterNonModifyAbleColumns(col){
    var blacklist = ['userID', 'createdAt', 'role','email', 'password'];
    if(blacklist.indexOf(col) !== -1){
        return false;
    }
    return true;
}
/**
 * Given a user object, updateBasicProfile will set the simple user object properties such as:
 * first name, last name, password, etc
 * TODO: Restrict being able to modify email address without first a confirmation of email
 * @param user
 */
exports.updateBasicProfile = function updateBasicProfile(user) {
    return db('users').modify(whereUniqueUser, user).update(user);
};


function createAvatarName() {
    return 'avatar' + '-' + Date.now() + '.png';
}

/**
 * Takes a user and a data uri of a png image, and with that creates a local file using the png data,
 * and sets in the database, the name of the newly created public avatar file.
 *
 * TODO: Remove a users pre existing avatar
 * @param user
 * @param avatarData
 * @returns {Promise.<string>} - A promise containing the filename of the avatar
 */
exports.updateUserAvatar = function updateUserAvatar(user, avatarData) {

    var base64Data = avatarData.replace(/^data:image\/png;base64,/, "");
    var avatarName = createAvatarName();
    var filePath = path.resolve(config.dirs.avatars, avatarName);

    function saveAvatar(avatarName) {
        return db('users').modify(whereUniqueUser, user).returning('avatar').update({
            avatar: avatarName
        }).then(function (singleElement) {
            return Promise.resolve(singleElement[0]);
        });
    }

    return new Promise(function (resolve, reject) {
        fs.writeFile(filePath, base64Data, 'base64', function (err) {
            if (err) {
                return reject(err);
            }
            resolve(avatarName);
        })
    }).then(saveAvatar);
};

/**
 * Takes a user and removes the corresponding avatar file and filename on the filesystem.
 * @param user
 * @returns {Promise.<string>} - the filename of the avatar which was deleted
 */
exports.deleteUserAvatar = function deleteUserAvatar(user) {


    function removeFile(u) {
        var avatarName = u.avatar;
        var filePath = path.resolve(config.dirs.avatars, avatarName);
        return new Promise(function (resolve, reject) {
            fs.unlink(filePath, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(avatarName);
            })
        })
    }

    function removePathFromDB() {
        return db('users').modify(whereUniqueUser, user).returning('avatar').update({
            avatar: null
        })
    }

    return Promise.all([retrieveUser(user).then(removeFile), removePathFromDB()])
      .then(function (singleElement) {
          return Promise.resolve(singleElement[0]);
      });


};

/**
 * Cache for listing the table columns
 * @type {{}}
 */
var tableColCache = {};
/**
 * Takes a table name and with that generates a query to get all columns and their datatypes
 * from the database.
 * @example
 * listTableColumns('users').then(function(data){
 *      console.log(data)  // [ { column_name: 'userID', data_type: 'integer' }, ... ]
 * });
 *
 * @param {string} table - the table name
 * @returns {Promise} Returns the knex query to execute
 */
function listTableColumns(table) {

    // use tableColCache if possible
    if (tableColCache[table] !== undefined) {
        return  Promise.resolve(tableColCache[table]);
    }

    var query = db.select(['column_name', 'data_type']).from('information_schema.columns')
      .where('table_schema', 'public')
      .andWhere('table_name', table);

    // set tableColCache for subsequent calls
    return query.tap(function (data) {
        tableColCache[table] = data;
    });
}

function userCheck(checkName, password, cb) {
    if (checkName === undefined || password === undefined) {
        return cb(null, false);
    }
    return db.select().where('email', checkName).from('users').then(function (rows) {

        // no user found
        if (rows.rowCount == 0 || rows.length == 0) {
            return cb(null, false, {message: 'email or password is invalid'});
        }
        var hash = rows[0].password;

        // check for password mismatch
        bcrypt.compare(password, hash, function (err, res) {
            if (res) {
                // return our user object
                return cb(null, rows[0]);
            } else {
                return cb(null, false, {message: 'email or password is invalid'});
            }
        });

    }).catch(function (e) {
        // Finally, add a .catch handler for the promise chain
        return cb(e);
    });
}

/**
 * Takes a userID for an exisiting
 * @param id
 * @param cb
 * @returns {*}
 */
function deserializeUser(req, id, cb) {

    return db.select().where('userID', id).from('users').then(function (rows) {
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
function getCaseWorkerCases(user) {
    return db.select().from('cases').where('caseWorker', user.userID).on('query-response', logBusinessRequest(getCaseWorkerCases.name))
}


/**
 * Gets a users cases
 * @user id
 * @return Promise with array of cases, if any
 */
function getFosterParentCases(user) {
    return db.select().from('cases').where('fosterParent', user.userID)
}

/**
 * Checks if table contains row with data matching specified object
 * @param table - name of postgres table
 * @param dataFields - JSON object containing column name as key and corresponding desired value
 * @return callback
 */
function checkExist(table, dataFields, cb) {
    var dataExists = true;
    for (key in dataFields) {
        var dataPoint = dataFields[key];
        db.select().where(key, dataPoint).from(table).then(function (rows) {
            //no data found
            if (rows.rowCount == 0 || rows.length == 0) {
                dataExists = false;
            }
            return cb(null, dataExists);
        }).catch(function (e) {
            return cb(e);
        });
    }
}


exports.getUserMessages = function getUserMessages(id) {
    return db.select().from('messages').where('fromID', id);
}

exports.getRecievedMessages = function getRecievedMessages(id) {
    return db.select().from('messages').where('recipientID', id);
}


/**
 * TODO
 * @user id
 * @returns {string}
 */
function getFosterParentsInContactWith(caseWorker) {
    // any messages which this case worker is in contact with
    db.select().from('messages').where('fromPersonID', caseWorker.userID).orWhere('toPersonID', caseWorker.userID);
    return db.select().from('users').join('')
}


var chalk = require('chalk');

var colored = function (fn) {
    return function () {
        var enabled = chalk.enabled;
        chalk.enabled = true;
        fn.apply(this, arguments);
        chalk.enabled = enabled;
    }
};

function logQueries(knex, options) {
    var opts = options || {};

    return function (req, res, next) {

        // TODO: improve color support with levels for info/warn/error
        // TODO: add an option to only log if a certain number of queries occur per
        // request

        var queries = [];
        var captureQueries = function (builder) {
            var startTime = process.hrtime();
            var group = []; // captured for this builder

            builder.on('query', function (query) {
                group.push(query);
                queries.push(query);
            });
            builder.on('end', function () {
                // all queries are completed at this point.
                // in the future, it'd be good to separate out each individual query,
                // but for now, this isn't something that knex supports. see the
                // discussion here for details:
                // https://github.com/tgriesser/knex/pull/335#issuecomment-46787879
                var diff = process.hrtime(startTime);
                var ms = diff[0] * 1e3 + diff[1] * 1e-6;
                group.forEach(function (query) {
                    query.duration = ms.toFixed(3);
                });
            });
        };

        var logQueries = colored(function () {
            res.removeListener('finish', logQueries);
            res.removeListener('close', logQueries);
            knex.client.removeListener('start', captureQueries);

            queries.forEach(function (query) {
                var color = chalk.cyan;
                console.log('%s %s %s %s',
                  chalk.gray('SQL'),
                  color(query.sql),
                  chalk.gray('{' + query.bindings.join(', ') + '}'),
                  chalk.bgMagenta(query.duration + 'ms'));
            });
        });

        knex.client.on('start', captureQueries);
        res.on('finish', function() {
            res.removeListener('finish', logQueries);
            res.removeListener('close', logQueries);
            knex.client.removeListener('start', captureQueries);
        })
        res.on('close', logQueries);

        next();
    };
};


