var db = require('../lib/db');

db.schema.hasTable('users').then(function(exists) {
    /* Drops the table if it exists.  This is useful to uncomment when you are working on editing the schema */
    // if (exists) {
    //   db.schema.dropTable('users').then(function() {
    //     console.log("Removed User Table");
    //   });
    //   exists = false;
    // }

    /* Create users table if it doesn't exist. */
    if (!exists) {
        db.schema.createTable('users', function(table) {
            table.increments('id');
            table.string('name');
            table.string('email');
            table.timestamp('created_at').notNullable().defaultTo(db.raw('now()'));
        }).then(function(table) {
            console.log('Created Posts Table');
        });
    }
});


//db.insert({name: 'Tim'}).into('users');

