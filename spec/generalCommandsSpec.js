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
    ezmlm = proxyquire('../lib/index', {'./ezmlmExec': {perform: execSpy}})('/fqHomedirectory', 'derleider.de', 'owner@derleider.de');
  });

  describe('creating a list', function () {
    it('performs a clean "make"', function () {
      ezmlm.createListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.be('ezmlm-make -5 owner@derleider.de -abDEfgHIJLMNOPRsTu /fqHomedirectory/ezmlm/someCrazyName /fqHomedirectory/.qmail-someCrazyName someCrazyName derleider.de');
    });

    it('performs a "make" with digests', function () {
      flags.digest(true);
      ezmlm.createListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.be('ezmlm-make -5 owner@derleider.de -abdEfgHIJLMNOPRsTu /fqHomedirectory/ezmlm/someCrazyName /fqHomedirectory/.qmail-someCrazyName someCrazyName derleider.de');
    });

    it('performs a "make" with moderation', function () {
      flags.moderate(true);
      ezmlm.createListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.be('ezmlm-make -5 owner@derleider.de -abDEfgHIJLmNOPRsTU /fqHomedirectory/ezmlm/someCrazyName /fqHomedirectory/.qmail-someCrazyName someCrazyName derleider.de');
    });

    it('never is in editmode', function () {
      flags.edit(true);
      ezmlm.createListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.match(/ezmlm-make -5 owner@derleider\.de -\w\w\wE/);
    });
  });

  describe('editing a list', function () {
    it('never has qmail-file, listname and domain as arguments', function () {
      ezmlm.editListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.be('ezmlm-make -5 owner@derleider.de -abDefgHIJLMNOPRsTu /fqHomedirectory/ezmlm/someCrazyName');
    });

    it('always is in editmode', function () {
      flags.edit(false);
      ezmlm.editListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.match(/ezmlm-make -5 owner@derleider\.de -\w\w\we/);
    });

    it('performs a "make" with moderation', function () {
      flags.moderate(true);
      ezmlm.editListNamed('someCrazyName', flags);
      expect(execSpy.args[0][0]).to.be('ezmlm-make -5 owner@derleider.de -abDefgHIJLmNOPRsTU /fqHomedirectory/ezmlm/someCrazyName');
    });

  });

});

describe('setting custom ezmlmrc', function () {
  var
    flags,
    ezmlm,
    execStub;

  beforeEach(function () {
    flags = flagsFactory();
    execStub = sinon.stub();
    ezmlm = proxyquire('../lib/index', {'./ezmlmExec': {perform: execStub}})('/fqHomedirectory', 'derleider.de', 'owner@derleider.de', 'ezmlmrc-custom');
  });

  it('works with create', function (done) {
    execStub.callsArgWith(1, null);
    ezmlm.createListNamed('someCrazyName', flags, 'p r e f i x', function () {
      expect(execStub.calledTwice).to.be(true);
      expect(execStub.args[0][0]).to.be('ezmlm-make -5 owner@derleider.de -abDEfgHIJLMNOPRsTu -C /fqHomedirectory/ezmlmrc-custom /fqHomedirectory/ezmlm/someCrazyName /fqHomedirectory/.qmail-someCrazyName someCrazyName derleider.de');
      expect(execStub.args[1][0]).to.be('echo "[p r e f i x]" > /fqHomedirectory/ezmlm/someCrazyName/prefix');
      done();
    });
  });

  it('works with edit', function (done) {
    execStub.callsArgWith(1, null);
    ezmlm.editListNamed('someCrazyName', flags, 'p r e f i x', function () {
      expect(execStub.calledTwice).to.be(true);
      expect(execStub.args[0][0]).to.be('ezmlm-make -5 owner@derleider.de -abDefgHIJLMNOPRsTu -C /fqHomedirectory/ezmlmrc-custom /fqHomedirectory/ezmlm/someCrazyName');
      expect(execStub.args[1][0]).to.be('echo "[p r e f i x]" > /fqHomedirectory/ezmlm/someCrazyName/prefix');
      done();
    });
  });

  it('shows errors', function (done) {
    execStub.onFirstCall().callsArgWith(1, new Error('Ooops'));
    ezmlm.createListNamed('someCrazyName', flags, 'p r e f i x', function (err) {
      expect(execStub.calledOnce).to.be(true);
      expect(execStub.args[0][0]).to.be('ezmlm-make -5 owner@derleider.de -abDEfgHIJLMNOPRsTu -C /fqHomedirectory/ezmlmrc-custom /fqHomedirectory/ezmlm/someCrazyName /fqHomedirectory/.qmail-someCrazyName someCrazyName derleider.de');
      expect(err).to.exist();
      done();
    });
  });

});


