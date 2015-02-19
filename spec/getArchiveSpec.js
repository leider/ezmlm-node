'use strict';

var
  sinon = require('sinon'),
  proxyquire = require('proxyquire'),
  expect = require('must');

describe('getting archived mails', function () {
  var
    ezmlm,
    execStub;

  beforeEach(function () {
    execStub = sinon.stub();
    ezmlm = proxyquire('../lib/index', {'./ezmlmExec': {perform: execStub}})('/fqHomedirectory', 'derleider.de');
  });

  it('creates the right command', function () {
    ezmlm.archivedMails('someCrazyName', 365);
    expect(execStub.args[0][0]).to.be('find /fqHomedirectory/ezmlm/someCrazyName/archive ! -name index -ctime -365');
  });

  it('creates an array from stdout', function (done) {
    execStub.callsArgWith(1, null, '/home/user/ezmlm/archive/0/0\n/home/user/ezmlm/archive/0/1');
    ezmlm.archivedMails('someCrazyName', 365, function (error, lists) {
      expect(lists).to.be.an.array();
      expect(lists).to.have.length(2);
      expect(lists[0]).to.be('/home/user/ezmlm/archive/0/0');
      expect(lists[1]).to.be('/home/user/ezmlm/archive/0/1');
      done();
    });
  });

  it('handles error from cmd line', function (done) {
    execStub.callsArgWith(1, new Error('mmmpp'));
    ezmlm.archivedMails('someCrazyName', 365, function (error, lists) {
      expect(error).to.exist();
      expect(lists).to.be.an.array();
      expect(lists).to.be.empty();
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


