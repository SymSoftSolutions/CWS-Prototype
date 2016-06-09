var db = require('../lib/db');
var tables = require('./tables');
var dbUtils = require('../lib/dbUtils');

exports.createAll = createAll;

var testUser = {
    firstName: 'John',
    lastName: 'Doe',
    password: '123',
    email: "test@example.com",
    role: tables.roles.fosterParent,
    avatar: "avatar-1465503834769.png",
    userDetails: {
        residence: {
            address: "1234 no where",
            city: "sac",
            zipcode: '95843',
            phone: '123-456-7890',
            state: 'CA',
            type: 'lease',
            weapons: 'true'
        }
    }
};
exports.testUser =  testUser;

var testCaseWorker = {
    firstName: 'Jane',
    lastName: 'Doe',
    password: '123',
    email: "case@example.com",
    avatar: "avatar-1465503635430.png",
    role: tables.roles.caseWorker
};

exports.testCaseWorker =  testCaseWorker;


/**
 * Helper function which reduces the required boilerplate code inorder to create tables
 * @param tableName - string of the table
 * @param func - the knex function which creates the columns for this table
 * @returns {Promise} - a Promise that resolves when the table has been created in the db
 */
function createTable(tableName, func) {
    return function () {
        return db.schema.hasTable(tableName).then(function (exists) {
            if (!exists) {
                return db.schema.createTableIfNotExists(tableName, func)
                    .then(function () {
                        console.log("Conditionally Creating " + tableName)
                    })
                    .catch(function (e) {
                        console.log(e);
                    })
            }
        });

    }
}

/**
 * Create the required sample test users, in the correct order, and only
 * if need be
 */
function createTestObjects() {
    var users = [testUser, testCaseWorker];
    
    var promises = users.map(function(user){
        function insertTstUser(result) {
            if (!result.length) {
                console.log("Creating Test Objects")
                return dbUtils.insertUser(user);
            } else {
                return Promise.reject("Already Created User")
            }
        }
        var checkExist = db.select('*').from('users').where('email', user.email)
        return db('users').whereExists(checkExist).then(insertTstUser)
    });
    return Promise.all(promises)
        .then(function(){
            return dbUtils.assignCaseWorker(testUser, testCaseWorker);
        })
        .catch(function (e) {
        console.log(e);

    })
}


/**
 * We create our tables in the required order for column and key relationships
 * @returns {*}
 */
function createAll() {
    return createTable('users', tables.createUserTable)()
        .then(createTable('cases', tables.createCaseTable))
        .then(createTable('messages', tables.createMessageTable))
        .then(createTable('notes', tables.createCaseNotesTable))
        .finally(createTestObjects);
}


/**
 * When run as a standalone program we create then exit
 */
if (require.main === module) {
    createAll().finally(function () {
        console.log("\nDone Creating Tables");
        process.exit();
    })
}

