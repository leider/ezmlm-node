'use strict';

const sinon = require('sinon');
const proxyquire = require('proxyquire');
const expect = require('must');

describe('listing users', () => {
  let ezmlm;
  let execStub;

  beforeEach(() => {
    execStub = sinon.stub();
    ezmlm = proxyquire('../lib/index', {'./ezmlmExec': {perform: execStub}})('/fqHomedirectory', 'derleider.de');
  });

  it('creates the correct command string', () => {
    ezmlm.usersOfList('someCrazyName');
    expect(execStub.args[0][0]).to.be('ezmlm-list /fqHomedirectory/ezmlm/someCrazyName');
  });

  it('creates an array from stdout', done => {
    execStub.callsArgWith(1, null, 'someuser@domain.org\nsomeother@domain.org');
    ezmlm.usersOfList('someCrazyName', (error, users) => {
      expect(users).to.be.an.array();
      expect(users).to.have.length(2);
      expect(users[0]).to.be('someuser@domain.org');
      expect(users[1]).to.be('someother@domain.org');
      done();
    });
  });

  it('handles error from cmd line', done => {
    execStub.callsArgWith(1, new Error('mmmpp'));
    ezmlm.usersOfList('someCrazyName', (error, users) => {
      expect(error).to.exist();
      expect(users).to.be.an.array();
      expect(users).to.be.empty();
      done();
    });
  });

  it('handles empty result from cmd line', done => {
    execStub.callsArgWith(1, null, '');
    ezmlm.usersOfList('someCrazyName', (error, users) => {
      expect(users).to.be.an.array();
      expect(users).to.be.empty();
      done(error);
    });
  });

});


