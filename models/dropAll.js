var db = require('../lib/db');

var db = require('../lib/db');


db.schema.hasTable('message').then(function(exists) {
    if (exists) {
        db.schema.dropTable('message').then(function() {
            console.log("Removed messages Table");
        });
    }
}).then( function(){

    db.schema.hasTable('users').then(function(exists) {
        /* Drops the table if it exists.  This is useful to uncomment when you are working on editing the schema */
        if (exists) {
            db.schema.dropTable('users').then(function() {
                console.log("Removed User Table");
            });

        }
    });
})

