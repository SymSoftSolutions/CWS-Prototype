var db = require('../lib/db');

db.schema.hasTable('message').then(function(exists) {
    /* Drops the table if it exists.  This is useful to uncomment when you are working on editing the schema */
    if (exists) {
      db.schema.dropTable('message').then(function() {
        console.log("Removed messages Table");
      });
      exists = false;
    }

    /* Create users table if it doesn't exist. */
    if (!exists) {
        db.schema.createTable('message', function(table) {
            //bookkeeping
            table.increments('messageID');
            table.timestamp('createdAt').notNullable().defaultTo(db.raw('now()'));

            // identification
            table.integer('fromPersonID')
                .unsigned()
                .notNullable()
                .references('userID').inTable('users');

            table.integer('toPersonID')
                .unsigned()
                .notNullable()
                .references('userID').inTable('users');

            //contacting
            table.string('message');
            table.boolean('hasRead')
            table.dateTime('readTime')


        }).then(function(table) {
            console.log('Created messages Table');
        });
    }
});

