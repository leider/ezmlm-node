'use strict';

var
  sinon = require('sinon'),
  proxyquire = require('proxyquire'),
  expect = require('must');

describe('getting all lists', function () {
  var
    ezmlm,
    execStub;

  beforeEach(function () {
    execStub = sinon.stub();
    ezmlm = proxyquire('../lib/commands', {'./ezmlmExec': {perform: execStub}})('/fqHomedirectory', 'derleider.de');
  });


  it('creates the correct command string', function () {
    ezmlm.allLists();
    expect(execStub.args[0][0]).to.be('ls /fqHomedirectory/ezmlm/');
  });

  it('creates an array from stdout', function (done) {
    execStub.callsArgWith(1, null, 'list1  list2');
    ezmlm.allLists(function (error, lists) {
      expect(lists).to.be.an.array();
      expect(lists).to.have.length(2);
      expect(lists[0]).to.be('list1');
      expect(lists[1]).to.be('list2');
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


