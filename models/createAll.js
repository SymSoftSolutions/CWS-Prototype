var db = require('../lib/db');
var tables = require('./tables');
var dbUtils = require('../lib/dbUtils');
exports.createAll = createAll;

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

    function testUser(result) {
        var user = {
            firstName: 'test',
            password: '123',
            zip: '95843',
            email: "test@example.com",
            role: 'fosterParent'
        };
        if (!result.length) {
            return dbUtils.insertUser(user);
        }
    }

    console.log("Creating Test Objects")
    return db('users').whereExists(db.select('*').from('users').where('email', "test@example.com"))
        .then(testUser).catch(function (e) {
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

