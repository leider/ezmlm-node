'use strict';

const sinon = require('sinon');
const proxyquire = require('proxyquire');
const expect = require('must');

describe('un-/subscribing users', () => {
  let ezmlm;
  let execStub;

  beforeEach(() => {
    execStub = sinon.stub();
    ezmlm = proxyquire('../lib/index', {'./ezmlmExec': {perform: execStub}})('/fqHomedirectory', 'derleider.de');
  });

  it('creates the correct command string for subscription', () => {
    ezmlm.subscribeUserToList('someuser@domain.org', 'someCrazyName');
    expect(execStub.args[0][0]).to.be('ezmlm-sub /fqHomedirectory/ezmlm/someCrazyName someuser@domain.org');
  });

  it('creates the correct command string for unsubscription', () => {
    ezmlm.unsubscribeUserFromList('someuser@domain.org', 'someCrazyName');
    expect(execStub.args[0][0]).to.be('ezmlm-unsub /fqHomedirectory/ezmlm/someCrazyName someuser@domain.org');
  });

});


