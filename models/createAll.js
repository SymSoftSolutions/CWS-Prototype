var db = require('../lib/db');
var tables = require('./tables');

exports.createAll = createAll;

function createTable(tableName, func){
    return function(){
         return db.schema.hasTable(tableName).then(function(exists) {
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


function createAll(){
   return createTable('users', tables.createUserTable)()
        .then(createTable('cases', tables.createCaseTable))
        .then(createTable('messages', tables.createMessageTable));
}


if (require.main === module) {
    createAll().finally(function () {
        console.log("\nDone Creating Tables");
        process.exit();
    })
}

