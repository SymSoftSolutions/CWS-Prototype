var db = require('../lib/db');


/**
 * Helper function which reduces the required boilerplate code inorder to drop tables
 * @param tableName - string of the table
 * @returns {Promise} - a Promise that resolves when the table has been dropped in the db
 */
function dropTables(tableName) {
    return function () {
        return db.raw('DROP TABLE IF EXISTS ' + tableName + ' CASCADE')
            .then(function () {
                console.log("Conditionally Dropping " + tableName)
            })
            .catch(function (e) {
                console.log(e);
            })

    }
}

exports.dropAll = function dropAll() {
    return dropTables('notes')()
      .then(dropTables('cases'))
      .then(dropTables('messages'))
      .then(dropTables('users'))
}



if (require.main === module) {
    exports.dropAll().finally(function () {
        console.log("\nDone Dropping Tables");
        process.exit();
    })
}



