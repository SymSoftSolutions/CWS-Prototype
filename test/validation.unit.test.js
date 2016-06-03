var expect = require('chai').expect;
var dbUtils = require('../lib/dbUtils');
var profileCreation = require('../routes/newprofile');

xdescribe('tests whether user form works;', function () {
    describe('check existence function works correctly', function() {
        it('should work when all fields are defined', function(done) {
            dbUtils.checkExist('users', {'email':'test@example.com'}, function(err, exist) {
                expect(err).to.equal(null);
                expect(exist).to.equal(true);
            });
            dbUtils.checkExist('users', {'email': 'doesnotexist@example.gov'}, function(err, exist) {
                expect(err).to.equal(null);
                expect(exist).to.equal(false);
            })
            done();
        });

        it('should be able to deal with varying lengths of data', function(done) {
            dbUtils.checkExist('users', {}, function(err, exist) {
                expect(err).to.equal(null);
                expect(exist).to.equal(true);
            });
            dbUtils.checkExist('users', {'email': 'test@example.com',
                                         'firstName': 'test'}, function(err, exist) {
                expect(err).to.equal(null);
                expect(exist).to.equal(true);
            });
            dbUtils.checkExist('users', {'email': 'test@example.com',
                                         'firstName': 'nameThatDoesNotExist'}, function(err, exist) {
                expect(err).to.equal(null);
                expect(exist).to.equal(false);
            });
            done();
        });

        it('should throw error if the field is not in the table', function(done) {
            dbUtils.checkExist('users', {'some completely different field': true}, function(err, exist) {
                expect(err).to.not.equal(null);
            })
            dbUtils.checkExist('nonexistent table', {'email': 'doesnotexist@example.gov'}, function(err, exist) {
                expect(err).to.not.equal(null);
            })
            done();    
        });
    });

    xdescribe('check that validation check works', function() {
        it('should return true only if all fields (except email) are contained in req.body', function(done) {
            var body = {'email': 'user@example.com',
                        'firstName': 'Sample',
                        'lastName': 'User',
                        'password': 'password',
                        'confirmPassword': 'password'
                        };
            expect(profileCreation.checkAllFieldsExist(body)).to.equal(true);

            body['firstName'] = '';
            expect(profileCreation.checkAllFieldsExist(body)).to.equal(false);
            body = {'email': 'user@example.com',
                    'firstName': 'Sample',
                    'lastName': 'User',
                    'password': 'password',
                    'confirmPassword': 'password'
                    };

            body['lastName'] = '';
            expect(profileCreation.checkAllFieldsExist(body)).to.equal(false);
            body = {'email': 'user@example.com',
                    'firstName': 'Sample',
                    'lastName': 'User',
                    'password': 'password',
                    'confirmPassword': 'password'
                    };

            body['password'] = '';
            expect(profileCreation.checkAllFieldsExist(body)).to.equal(false);
            body = {'email': 'user@example.com',
                    'firstName': 'Sample',
                    'lastName': 'User',
                    'password': 'password',
                    'confirmPassword': 'password'
                    };

            body['confirmPassword'] = '';
            expect(profileCreation.checkAllFieldsExist(body)).to.equal(false);
            body = {'email': 'user@example.com',
                    'firstName': 'Sample',
                    'lastName': 'User',
                    'password': 'password',
                    'confirmPassword': 'password'
                    };
            
            expect(profileCreation.checkAllFieldsExist({})).to.equal(false);
            done();
        });
        it('should check that the passwords match', function(done) {
            var body = {'email': 'user@example.com',
                        'firstName': 'Sample',
                        'lastName': 'User',
                        'password': 'password',
                        'confirmPassword': 'different password'
                        };
            expect(profileCreation.checkAllFieldsExist(body)).to.equal(false);
            done();
        });
    });
});
