var db = require('../lib/db');

db.schema.hasTable('users').then(function(exists) {
    /* Drops the table if it exists.  This is useful to uncomment when you are working on editing the schema */
    if (exists) {
      db.schema.dropTable('users').then(function() {
        console.log("Removed User Table");
      });
      exists = false;
    }

    /* Create users table if it doesn't exist. */
    if (!exists) {
        db.schema.createTable('users', function(table) {
            //bookkeeping
            table.increments('userID'); //automatically the primary key
            table.timestamp('createdAt').notNullable().defaultTo(db.raw('now()'));

            table.string('password');

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
        }).then(function(){
            db.insert({firstName: 'test', password: '123', zip:'95843', email: "test@example.com"}).into('users')
                .then(function(rows){
                    console.log("Created " + rows.rowCount + " Users")
                });
        });
    }
});



