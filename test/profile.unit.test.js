var expect = require('chai').expect;
var dbUtils = require('../lib/dbUtils');

var config = require('../config');
var path = require('path')
var fs = require("fs");

// var request = require('supertest')
// var app = require('../server').app;
// app.set('is-testing', true);
// require('../server').setupServer();

describe('profile functionality', function () {

    var testUser = {
        firstName: 'tester',
        lastName: 'mcgee',
        password: 'password',
        email: "tester@example.com",
        role: 'fosterParent',
        userDetails: {
            testDetail: 1
        }
    };

    var testUserSuccess;
    before(function (done) {
        return dbUtils.insertUser(testUser).then(function (data) {
            // first user pack
            testUserSuccess = data[0];
             done();
        });
    });

    after(function (done) {
        dbUtils.removeUser(testUser).then(function (data) {
            done();
        });
    });

    describe('new profiles', function () {
        it('can be created on the database', function () {
            expect(testUserSuccess).not.undefined;
        });

        it('returns the userID and email upon successful database insert', function () {
            expect(testUserSuccess).to.have.property('userID');
            expect(testUserSuccess).to.have.property('email');
            expect(testUserSuccess.userID).to.be.a('number');
            expect(testUserSuccess.email).to.equal(testUser.email);
        });

        xit('cant have duplicate emails', function (done) {
            done();
        });

        xit('must be created with a valid email', function (done) {
            done();
        });

        xit('must be created with a password', function (done) {
            done();
        });

        xit('have their passwords stored as hashes', function (done) {
            done();
        });

        xit('can be retrieved with a valid user name and password pair', function (done) {
            done();
        });

        xit('shall be created on a router endpoint');
    });

    describe('basic information', function () {

        it('can be updated on the database', function (done) {
            testUser.firstName = 'name change';
            dbUtils.updateBasicProfile(testUser)
                .then(function (numberOfModifiedRows) {
                    expect(numberOfModifiedRows).to.equal(1);
                })
                .then(dbUtils.retrieveUser.bind(null, testUser))
                .then(function (user) {
                    expect(user).not.undefined;
                    expect(user.firstName).to.equal(testUser.firstName);
                    done();
                })
        });

        it('all form fields are shown in the view', function (done) {
            done();
        });

        it('form fields from view properly update user row in database', function (done) {
            done();
        });
    });

    describe('avatars', function(){

        var dataImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg==";
       it('can be created on the database and filesystem', function(done){
           dbUtils.updateUserAvatar(testUser, dataImage).then(function(name) {
               var filePath = path.resolve(config.dirs.avatars, name);
               var stat = fs.statSync(filePath);
               expect(stat.isFile()).to.be.true;
               dbUtils.retrieveUser(testUser).then(function(user){
                   expect(user.avatar).to.equal(name);
                   done();
               })
           })
       });

        xit('will only keep one per user');

        it('can be deleted from the filesystem and database', function(done){
            dbUtils.deleteUserAvatar(testUser).then(function(name){
                var filePath = path.resolve(config.dirs.avatars, name);
                var stat = fs.statSync(filePath);
                expect(stat.isFile()).to.be.false;
                dbUtils.retrieveUser(testUser).then(function(user){
                    console.log(user);
                    expect(user.avatar).to.be.undefined;
                    done();
                })
            });
            done();
        });
    });

    describe('user details', function () {
        var updateQuery;
        var lastNameChange = 'changed last';

        before(function (done) {
            updateQuery = dbUtils.updateUserDetails(testUser, {lastName: lastNameChange, badProp: 1, userDetails: {testDetail: 2, deep:{x: 1} } })
                .finally(function () {
                    done();
                })
              .catch(function(e){
                  console.log(e);
                  done();
              })
        });
        it('can be updated on the database', function (done) {
            updateQuery.then(function (numberOfModifiedRows) {
                expect(numberOfModifiedRows).to.equal(1);
                done();
            });
        });

        it('updates old properties', function (done) {
            dbUtils.retrieveUser(testUser)
                .then(function (user) {
                    expect(user).not.undefined;
                    expect(user.userDetails.testDetail).to.equal(2);
                    done();
                })
        });

        it('does not add new columns via erroneous properties', function(done){
            dbUtils.retrieveUser(testUser)
              .then(function (user) {
                  expect(user.badProp).to.be.undefined;
                  done();
              })
        })

        it('adds new properties to the userDetails', function (done) {
            dbUtils.retrieveUser(testUser)
                .then(function (user) {
                    expect(user.userDetails.deep.x).to.deep.equal(1);
                    done();
                })
        });
    })

});

