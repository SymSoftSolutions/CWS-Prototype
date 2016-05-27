var db = require('../lib/db');

exports.createUserTable = createUserTable;
exports.createMessageTable = createMessageTable;
exports.createCaseTable = createCaseTable;
exports.createCaseNotesTable = createCaseNotesTable;


/**
 * Creates the columns required for modeling a user.
 * @param table The table which the columns will be created on
 */
function createUserTable(table) {
    //bookkeeping
    table.increments('userID'); //automatically the primary key
    table.timestamp('createdAt').notNullable().defaultTo(db.raw('now()'));

    // auth pair
    table.string('email').notNullable().unique();
    table.string('password').notNullable();

    // identification
    table.string('firstName');
    table.string('lastName');
    table.date('dateOfBirth');

    // location
    table.string('address');
    table.string('city');
    table.string('state');
    table.string('zip');

    //contacting
    table.string('workPhone');
    table.string('homePhone');

    // simple roles
    table.enu('role', ['fosterParent', 'caseWorker']).notNullable();
}


/**
 * Creates the columns required for modeling messages across the system.
 * @param table The table which the columns will be created on
 */
function createMessageTable(table) {
    //bookkeeping
    table.increments('messageID');
    table.timestamp('createdAt').notNullable().defaultTo(db.raw('now()'));

    // identification
    table.integer('fromID')
        .unsigned()
        .notNullable()
        .references('userID').inTable('users');


    // identification
    //TODO: Enforce constraint of userID
    table.specificType('recipientID', 'INTEGER[]')
        .notNullable()

    table.integer('caseID')
        .unsigned()
        .notNullable()
        .references('caseID').inTable('cases');

    //contacting
    table.string('message');
    table.boolean('hasRead');
    table.dateTime('readTime');
}

/**
 * Creates the columns required for modeling cases across the system.
 * @param table The table which the columns will be created on
 */
function createCaseTable(table){

    table.increments("caseID");
    table.timestamp('createdAt').notNullable().defaultTo(db.raw('now()'));

    // identification
    //TODO: Enforce constraint of caseWorker role
    table.specificType('caseWorkers', 'INTEGER[]')
        .notNullable();


    // identification
    table.integer('fosterParent')
        .unsigned()
        .notNullable()
        .references('userID').inTable('users');

    // additional information
    table.specificType('noteID', 'INTEGER[]')
}

/**
 * Creates the columns required for modeling notes across the system.
 * @param table The table which the columns will be created on
 */
function createCaseNotesTable(table){
    // bookkeeping
    table.increments("noteID");
    table.timestamp('createdAt').notNullable().defaultTo(db.raw('now()'));

    // note details
    table.string('status');
    table.text('detail');
}