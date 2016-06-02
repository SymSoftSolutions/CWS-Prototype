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
    // empty avatar
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
    role: tables.roles.caseWorker
};

exports.testCaseWorker =  testCaseWorker;


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

function createTestObjects() {
    var users = [testUser, testCaseWorker];


    var promises = users.map(function(user){
        function insertTstUser(result) {
            if (!result.length) {
                console.log("Creating Test Objects")
                return dbUtils.insertUser(user);
            }
        }
        var checkExist = db.select('*').from('users').where('email', user.email)
        return db('users').whereExists(checkExist).then(insertTstUser)

    })
    return Promise.all(promises).catch(function (e) {
        console.log(e);
    });
}


function createAll() {
    return createTable('users', tables.createUserTable)()
        .then(createTable('cases', tables.createCaseTable))
        .then(createTable('messages', tables.createMessageTable))
        .then(createTable('notes', tables.createCaseNotesTable))
        .finally(createTestObjects);
}


if (require.main === module) {
    createAll().finally(createTestObjects).finally(function () {
        console.log("\nDone Creating Tables");
        process.exit();
    })
}

