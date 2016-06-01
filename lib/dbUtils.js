// Setting up the connection to the postgres database
var db = require('./db');
// for our password hashing
var bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;

exports.userCheck = userCheck;
exports.deserializeUser = deserializeUser;

exports.retrieveUser = retrieveUser;
exports.insertUser = insertUser;
exports.removeUser = removeUser;
exports.updateBasicProfile = updateBasicProfile;

exports.listTableColumns = listTableColumns;
exports.logQueries = logQueries;
exports.checkExist = checkExist;

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

/**
 * Inserts a user object into our db
 * @param user
 * @returns {Promise}
 */
function insertUser(user) {
    // Store hashed pass
    user.password = bcrypt.hashSync(user.password);
    return db.insert(user).into('users').returning(['userID', 'email'])
}


function retrieveUser(user){
    return db.first().modify(whereUniqueUser, user).from('users');
}


function removeUser(user) {
    return db.from('users').modify(whereUniqueUser, user).del();
}


/**
 * Given a user object, updateBasicProfile will set the simple user object properties such as:
 * first name, last name, password, etc
 * TODO: Restrict being able to modify email address without first a confirmation of email
 * @param user
 */
function updateBasicProfile(user) {
    return db('users').modify(whereUniqueUser, user).update(user);
}

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
        return new Promise.resolve(tableColCache[table]);
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
            return cb(null, false, {message: 'username or password is invalid'});
        }
        var hash = rows[0].password;

        // check for password mismatch
        bcrypt.compare(password, hash, function (err, res) {
            if (res) {
                // return our user object
                return cb(null, rows[0]);
            } else {
                return cb(null, false, {message: 'username or password is invalid'});
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

/**
 * Checks if table contains row with data matching specified object
 * @param table - name of postgres table
 * @param dataFields - JSON object containing column name as key and corresponding desired value
 * @return callback
 */
function checkExist(table, dataFields, cb) {
    var dataExists = true;
    for(key in dataFields) {
        console.log(key);
        
        var dataPoint = dataFields[key];
        console.log(dataPoint);
        
        db.select().where(key, dataPoint).from(table).then(function(rows){
            console.log('search was built');
            console.log(rows);
            //no data found
            if(rows.rowCount == 0 || rows.length == 0) {
                dataExists = false;
            }
            return cb(null, dataExists);
        }).catch(function (e) {
            return cb(e);
        });
    }
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
        res.on('finish', () => {
            res.removeListener('finish', logQueries);
            res.removeListener('close', logQueries);
            knex.client.removeListener('start', captureQueries);
        });
        res.on('close', logQueries);

        next();
    };
};


