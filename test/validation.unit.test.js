var expect = require('chai').expect;
var dbUtils = require('../lib/dbUtils');

describe('test validation code', function () {
    dbUtils.checkExist('users', {'email':'test@example.com'}, function(err, exist) {
        expect(err).to.equal(null);
        expect(exist).to.equal(true);
    });
    dbUtils.checkExist('users', {}, function(err, exist) {
        expect(err).to.equal(null);
        expect(exist).to.equal(true);
    });

    dbUtils.checkExist('users', {'email': 'doesnotexist@example.gov'}, function(err, exist) {
        expect(err).to.equal(null);
        expect(exist).to.equal(false);
    })

    dbUtils.checkExist('users', {'some completely different field': true}, function(err, exist) {
        expect(err).to.not.equal(null);
    })
});
