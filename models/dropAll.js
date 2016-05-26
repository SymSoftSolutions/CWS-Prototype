var db = require('../lib/db');

function dropTables(tableName) {
    return function () {
        return db.raw('DROP TABLE IF EXISTS ' + tableName + ' CASCADE')
            .then(function () {
                console.log("Conditionally Dropping " + tableName)
            })
            .catch(function (e) {
                // console.log("Conditionally Dropping " + tableName)
                console.log(e);
            })

    }
}

dropTables('notes')()
    .then(dropTables('cases'))
    .then(dropTables('messages'))
    .then(dropTables('users'))
    .finally(function () {
        console.log("\nDone Dropping Tables");
        process.exit();
    });

