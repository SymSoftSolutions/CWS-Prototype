var db = require('../lib/db');
var tables = require('./tables');


function createTable(tableName, func){
    return function(){
        return db.schema.createTableIfNotExists(tableName,func)
            .then(function () {
                console.log("Conditionally Creating " + tableName)
            })
            .catch(function (e) {
                console.log("Conditionally Creating " + tableName)
                //console.log(e);
            })
    }
}

createTable('users', tables.createUserTable)()
    .then(createTable('cases', tables.createCaseTable))
    .then(createTable('messages', tables.createMessageTable))
    .finally(function () {
        console.log("\nDone Creating Tables");
        process.exit();
    })
