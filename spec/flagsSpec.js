'use strict';

var
  expect = require('must'),
  flagsFactory = require('../lib/flags');

describe('the options', function () {
  var flags;

  beforeEach(function () {
    flags = flagsFactory();
  });

  it('can transform itself to commandline flags', function () {
    expect(flags.asFlags()).to.be('abDEfgHIJLMNOPRsTu');
  });

  it('can enable digesting', function () {
    expect(flags.asFlags()).to.contain('D');
    flags.digest(true);
    expect(flags.asFlags()).to.contain('d');
  });

  it('can enable moderation', function () {
    expect(flags.asFlags()).to.contain('M');
    flags.moderate(true);
    expect(flags.asFlags()).to.contain('m');
  });

  it('can enable "edit-mode"', function () {
    expect(flags.asFlags()).to.contain('E');
    flags.edit(true);
    expect(flags.asFlags()).to.contain('e');
  });
});
