var expect = require('chai').expect;
var dbUtils = require('../lib/dbUtils');

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

        dbUtils.insertUser(testUser).then(function (data) {
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

        it('cant have duplicate emails', function (done) {
            done();
        });

        it('must be created with a valid email', function (done) {
            done();
        });

        it('must be created with a password', function (done) {
            done();
        });

        it('have their passwords stored as hashes', function (done) {
            done();
        });

        it('can be retrieved with a valid user name and password pair', function (done) {
            done();
        });

        it('shall be created on a router endpoint');
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
});
