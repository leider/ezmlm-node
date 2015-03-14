'use strict';

var
  sinon = require('sinon'),
  expect = require('must');

describe('Changing replyTo', function () {
  var
    modifyHeaders,
    execStub;

  beforeEach(function () {
    execStub = sinon.stub();
    modifyHeaders = require('../lib/modifyHeaders')('/fqHomedirectory', {perform: execStub});
  });

  it('creates the right commands for reply to list', function (done) {
    execStub.callsArgWith(1, null);
    modifyHeaders.replyToList('someCrazyName', done);
    expect(execStub.args[0][0]).to.contain('"Sender: <<#l#>@<#h#>>\nPrecedence: bulk\nX-No-Archive: yes\nList-Post: <mailto:<#l#>@<#h#>>');
    expect(execStub.args[0][0]).to.contain('\nReply-To: <<#l#>@<#h#>>\n');
    expect(execStub.args[0][0]).to.contain('" > /fqHomedirectory/ezmlm/someCrazyName/headeradd');
    expect(execStub.args[1][0]).to.contain('"return-path\nreturn-receipt-to\ncontent-length\nprecedence\nx-confirm-reading-to\nx-pmrqc\nlist-subscribe\nlist-unsubscribe\nlist-help\nlist-post\nsender\n');
    expect(execStub.args[1][0]).to.contain('reply-to\n');
    expect(execStub.args[1][0]).to.contain('\" > /fqHomedirectory/ezmlm/someCrazyName/headerremove');
  });

  it('creates the right commands for reply to sender', function (done) {
    execStub.callsArgWith(1, null);
    modifyHeaders.replyToSender('someCrazyName', done);
    expect(execStub.args[0][0]).to.contain('"Sender: <<#l#>@<#h#>>\nPrecedence: bulk\nX-No-Archive: yes\nList-Post: <mailto:<#l#>@<#h#>>');
    expect(execStub.args[0][0]).to.not.contain('\nReply-To: <<#l#>@<#h#>>\n');
    expect(execStub.args[0][0]).to.contain('" > /fqHomedirectory/ezmlm/someCrazyName/headeradd');
    expect(execStub.args[1][0]).to.contain('"return-path\nreturn-receipt-to\ncontent-length\nprecedence\nx-confirm-reading-to\nx-pmrqc\nlist-subscribe\nlist-unsubscribe\nlist-help\nlist-post\nsender\n');
    expect(execStub.args[1][0]).to.not.contain('reply-to\n');
    expect(execStub.args[1][0]).to.contain('\" > /fqHomedirectory/ezmlm/someCrazyName/headerremove');
  });

});


