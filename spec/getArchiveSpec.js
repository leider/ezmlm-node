'use strict';

const sinon = require('sinon');
const proxyquire = require('proxyquire');
const expect = require('must');

describe('getting archived mails', () => {
  let ezmlm;
  let execStub;

  beforeEach(() => {
    execStub = sinon.stub();
    ezmlm = proxyquire('../lib/index', {'./ezmlmExec': {perform: execStub}})('/fqHomedirectory', 'derleider.de');
  });

  it('creates the right command', () => {
    ezmlm.archivedMails('someCrazyName', 365);
    expect(execStub.args[0][0]).to.be('find /fqHomedirectory/ezmlm/someCrazyName/archive ! -name index -type f -ctime -365');
  });

  it('creates an array from stdout', done => {
    execStub.callsArgWith(1, null, '/home/user/ezmlm/archive/0/0\n/home/user/ezmlm/archive/0/1');
    ezmlm.archivedMails('someCrazyName', 365, (error, lists) => {
      expect(lists).to.be.an.array();
      expect(lists).to.have.length(2);
      expect(lists[0]).to.be('/home/user/ezmlm/archive/0/0');
      expect(lists[1]).to.be('/home/user/ezmlm/archive/0/1');
      done();
    });
  });

  it('handles error from cmd line', done => {
    execStub.callsArgWith(1, new Error('mmmpp'));
    ezmlm.archivedMails('someCrazyName', 365, (error, lists) => {
      expect(error).to.exist();
      expect(lists).to.be.an.array();
      expect(lists).to.be.empty();
      done();
    });
  });

  it('handles empty result from cmd line', done => {
    execStub.callsArgWith(1, null, '');
    ezmlm.archivedMails('someCrazyName', 365, (error, lists) => {
      expect(lists).to.be.an.array();
      expect(lists).to.be.empty();
      done(error);
    });
  });

});


