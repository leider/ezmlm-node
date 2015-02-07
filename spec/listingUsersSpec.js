'use strict';

var
  sinon = require('sinon'),
  proxyquire = require('proxyquire'),
  expect = require('must');

describe('listing users', function () {
  var
    ezmlm,
    execStub;

  beforeEach(function () {
    execStub = sinon.stub();
    ezmlm = proxyquire('../lib/commands', {'./ezmlmExec': {perform: execStub}})('/fqHomedirectory', 'derleider.de');
  });


  it('creates the correct command string', function () {
    ezmlm.usersOfList('someCrazyName');
    expect(execStub.args[0][0]).to.be('ezmlm-list /fqHomedirectory/ezmlm/someCrazyName');
  });

  it('creates an array from stdout', function (done) {
    execStub.callsArgWith(1, null, 'someuser@domain.org\nsomeother@domain.org');
    ezmlm.usersOfList('someCrazyName', function (error, users) {
      expect(users).to.be.an.array();
      expect(users).to.have.length(2);
      expect(users[0]).to.be('someuser@domain.org');
      expect(users[1]).to.be('someother@domain.org');
      done();
    });
  });

  it('handles error from cmd line', function (done) {
    execStub.callsArgWith(1, new Error('mmmpp'));
    ezmlm.usersOfList('someCrazyName', function (error, users) {
      expect(error).to.exist();
      expect(users).to.be.an.array();
      expect(users).to.be.empty();
      done();
    });
  });

  it('handles empty result from cmd line', function (done) {
    execStub.callsArgWith(1, null, '');
    ezmlm.usersOfList('someCrazyName', function (error, users) {
      expect(users).to.be.an.array();
      expect(users).to.be.empty();
      done(error);
    });
  });

});


