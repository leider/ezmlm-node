'use strict';

var
  sinon = require('sinon'),
  proxyquire = require('proxyquire'),
  expect = require('must');

describe('un-/subscribing users', function () {
  var
    ezmlm,
    execStub;

  beforeEach(function () {
    execStub = sinon.stub();
    ezmlm = proxyquire('../lib/commands', {'./ezmlmExec': {perform: execStub}})('/fqHomedirectory', 'derleider.de');
  });

  it('creates the correct command string for subscription', function () {
    ezmlm.subscribeUserToList('someuser@domain.org', 'someCrazyName');
    expect(execStub.args[0][0]).to.be('ezmlm-sub /fqHomedirectory/ezmlm/someCrazyName someuser@domain.org');
  });

  it('creates the correct command string for unsubscription', function () {
    ezmlm.unsubscribeUserFromList('someuser@domain.org', 'someCrazyName');
    expect(execStub.args[0][0]).to.be('ezmlm-unsub /fqHomedirectory/ezmlm/someCrazyName someuser@domain.org');
  });

});


