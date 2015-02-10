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
    ezmlm = proxyquire('../lib/index', {'./ezmlmExec': {perform: execSpy}})('/fqHomedirectory', 'derleider.de');
  });

  describe('creating a list', function () {
    it('performs a clean "make"', function () {
      ezmlm.createListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.be('ezmlm-make -abDEfgHIJLMNOPRSTu /fqHomedirectory/ezmlm/someCrazyName /fqHomedirectory/.qmail-someCrazyName someCrazyName derleider.de');
    });

    it('performs a "make" with digests', function () {
      flags.digest(true);
      ezmlm.createListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.be('ezmlm-make -abdEfgHIJLMNOPRSTu /fqHomedirectory/ezmlm/someCrazyName /fqHomedirectory/.qmail-someCrazyName someCrazyName derleider.de');
    });

    it('performs a "make" with moderation', function () {
      flags.moderate(true);
      ezmlm.createListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.be('ezmlm-make -abDEfgHIJLmNOPRSTu /fqHomedirectory/ezmlm/someCrazyName /fqHomedirectory/.qmail-someCrazyName someCrazyName derleider.de');
    });

    it('never is in editmode', function () {
      flags.edit(true);
      ezmlm.createListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.match(/ezmlm-make -\w\w\wE/);
    });
  });

  describe('editing a list', function () {
    it('never has qmail-file, listname and domain as arguments', function () {
      ezmlm.editListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.be('ezmlm-make -abDefgHIJLMNOPRSTu /fqHomedirectory/ezmlm/someCrazyName');
    });

    it('always is in editmode', function () {
      flags.edit(false);
      ezmlm.editListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.match(/ezmlm-make -\w\w\we/);
    });

    it('performs a "make" with moderation', function () {
      flags.moderate(true);
      ezmlm.editListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.be('ezmlm-make -abDefgHIJLmNOPRSTu /fqHomedirectory/ezmlm/someCrazyName');
    });

  });

});

describe('setting custom ezmlmrc', function () {
  var
    flags,
    ezmlm,
    execSpy;

  beforeEach(function () {
    flags = flagsFactory();
    execSpy = sinon.spy();
    ezmlm = proxyquire('../lib/index', {'./ezmlmExec': {perform: execSpy}})('/fqHomedirectory', 'derleider.de', 'ezmlmrc-custom');
  });

  it('works with create', function () {
    ezmlm.createListNamed('someCrazyName', flags);
    expect(execSpy.args[0][0]).to.be('ezmlm-make -abDEfgHIJLMNOPRSTu -C /fqHomedirectory/ezmlmrc-custom /fqHomedirectory/ezmlm/someCrazyName /fqHomedirectory/.qmail-someCrazyName someCrazyName derleider.de');
  });

  it('works with edit', function () {
    ezmlm.editListNamed('someCrazyName', flags);
    expect(execSpy.args[0][0]).to.be('ezmlm-make -abDefgHIJLMNOPRSTu -C /fqHomedirectory/ezmlmrc-custom /fqHomedirectory/ezmlm/someCrazyName');
  });

});


