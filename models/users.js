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
            //bookkeeping
            table.increments('id');
            table.timestamp('createdAt').notNullable().defaultTo(db.raw('now()'));

            // identification
            table.string('firstName');
            table.string('lastName');
            table.date('dataofbirth');

            // location
            table.string('address');
            table.string('city');
            table.string('state');
            table.string('zip')

            //contacting
            table.string('email');
            table.string('workphone');
            table.string('homephone');


        }).then(function(table) {
            console.log('Created Users Table');
        });
    }
});

//db.insert({firstName: 'Tim'}).into('users');

