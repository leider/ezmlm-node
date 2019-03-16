'use strict';

const sinon = require('sinon');
const proxyquire = require('proxyquire');
const expect = require('must');

describe('getting all lists', function () {
  let ezmlm;
  let execStub;

  beforeEach(() => {
    execStub = sinon.stub();
    ezmlm = proxyquire('../lib/index', {'./ezmlmExec': {perform: execStub}})('/fqHomedirectory', 'derleider.de');
  });

  it('creates the correct command string', () => {
    ezmlm.allLists();
    expect(execStub.args[0][0]).to.be('ls /fqHomedirectory/ezmlm/');
  });

  it('creates an array from stdout', done => {
    execStub.callsArgWith(1, null, 'list1\nlist2');
    ezmlm.allLists((error, lists) => {
      expect(lists).to.be.an.array();
      expect(lists).to.have.length(2);
      expect(lists[0]).to.be('list1');
      expect(lists[1]).to.be('list2');
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


