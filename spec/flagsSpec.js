'use strict';

const expect = require('must');
const flagsFactory = require('../lib/flags');

describe('the options', () => {
  let flags;

  beforeEach(function () {
    flags = flagsFactory();
  });

  it('can transform itself to commandline flags', () => {
    expect(flags.asFlags()).to.be('abDEfgHIJLMNOPRsTu');
  });

  it('can enable digesting', () => {
    expect(flags.asFlags()).to.contain('D');
    flags.digest(true);
    expect(flags.asFlags()).to.contain('d');
  });

  it('can enable moderation', () => {
    expect(flags.asFlags()).to.contain('M');
    flags.moderate(true);
    expect(flags.asFlags()).to.contain('m');
  });

  it('can enable "edit-mode"', () => {
    expect(flags.asFlags()).to.contain('E');
    flags.edit(true);
    expect(flags.asFlags()).to.contain('e');
  });
});
