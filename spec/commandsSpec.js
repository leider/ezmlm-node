'use strict';

var
  sinon = require('sinon'),
  proxyquire = require('proxyquire'),
  expect = require('must'),
  flagsFactory = require('../lib/flags');

describe('top level functions', function () {
  var
    flags,
    ezmlm,
    execSpy;

  beforeEach(function () {
    flags = flagsFactory();
    execSpy = sinon.spy();
    ezmlm = proxyquire('../lib/commands', {'./ezmlmExec': {perform: execSpy}});
  });

  describe('creating a list', function () {
    it('performs a clean "make"', function () {
      ezmlm('/fqHomedirectory', 'derleider.de').createListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.be('ezmlm-make -abDEfgHIJLMNOPRSTu /fqHomedirectory/ezmlm/someCrazyName /fqHomedirectory/.qmail-someCrazyName someCrazyName derleider.de');
    });

    it('performs a "make" with digests', function () {
      flags.digest(true);
      ezmlm('/fqHomedirectory', 'derleider.de').createListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.be('ezmlm-make -abdEfgHIJLMNOPRSTu /fqHomedirectory/ezmlm/someCrazyName /fqHomedirectory/.qmail-someCrazyName someCrazyName derleider.de');
    });

    it('performs a "make" with moderation', function () {
      flags.moderate(true);
      ezmlm('/fqHomedirectory', 'derleider.de').createListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.be('ezmlm-make -abDEfgHIJLmNOPRSTu /fqHomedirectory/ezmlm/someCrazyName /fqHomedirectory/.qmail-someCrazyName someCrazyName derleider.de');
    });

    it('never is in editmode', function () {
      flags.edit(true);
      ezmlm('/fqHomedirectory', 'derleider.de').createListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.match(/ezmlm-make -\w\w\wE/);
    });
  });

  describe('editing a list', function () {
    it('never has qmail-file, listname and domain as arguments', function () {
      ezmlm('/fqHomedirectory', 'derleider.de').editListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.be('ezmlm-make -abDefgHIJLMNOPRSTu /fqHomedirectory/ezmlm/someCrazyName');
    });

    it('always is in editmode', function () {
      flags.edit(false);
      ezmlm('/fqHomedirectory', 'derleider.de').editListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.match(/ezmlm-make -\w\w\we/);
    });

  });

});

describe('listing users', function () {
  var
    ezmlm,
    execStub;

  beforeEach(function () {
    execStub = sinon.stub();
    ezmlm = proxyquire('../lib/commands', {'./ezmlmExec': {perform: execStub}});
  });


  it('creates the correct command string', function () {
    ezmlm('/fqHomedirectory', 'derleider.de').usersOfList('someCrazyName');
    expect(execStub.args[0][0]).to.be('ezmlm-list /fqHomedirectory/ezmlm/someCrazyName');
  });

  it('creates an arry from stdout', function (done) {
    execStub.callsArgWith(1, null, 'someuser@domain.org\nsomeother@domain.org');
    ezmlm('/fqHomedirectory', 'derleider.de').usersOfList('someCrazyName', function (error, users) {
      expect(users).to.be.an.array();
      expect(users).to.have.length(2);
      expect(users[0]).to.be('someuser@domain.org');
      expect(users[1]).to.be('someother@domain.org');
      done();
    });
  });

  it('handles error from cmd line', function (done) {
    execStub.callsArgWith(1, new Error('mmmpp'));
    ezmlm('/fqHomedirectory', 'derleider.de').usersOfList('someCrazyName', function (error, users) {
      expect(error).to.exist();
      expect(users).to.be.an.array();
      expect(users).to.be.empty();
      done();
    });
  });

  it('handles empty result from cmd line', function (done) {
    execStub.callsArgWith(1, null, '');
    ezmlm('/fqHomedirectory', 'derleider.de').usersOfList('someCrazyName', function (error, users) {
      expect(users).to.be.an.array();
      expect(users).to.be.empty();
      done(error);
    });
  });

});


