var db = require('../lib/db');

exports.createUserTable = createUserTable;
exports.createMessageTable = createMessageTable;
exports.createCaseTable = createCaseTable;

function createUserTable(table) {
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

}


function createMessageTable(table) {
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


    table.integer('caseID')
        .unsigned()
        .notNullable()
        .references('caseID').inTable('cases');

    //contacting
    table.string('message');
    table.boolean('hasRead')
    table.dateTime('readTime')
}


function createCaseTable(table){

    table.increments("caseID");
    table.timestamp('createdAt').notNullable().defaultTo(db.raw('now()'));

    // identification
    table.integer('caseWorker')
        .unsigned()
        .notNullable()
        .references('userID').inTable('users');

    // identification
    table.integer('fosterParent')
        .unsigned()
        .notNullable()
        .references('userID').inTable('users');
}
