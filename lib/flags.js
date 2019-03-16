const keys = require('lodash.keys');
const lettersForOptions = {
  archived: 'a',
  archiveBlocked: 'b',
  digest: 'd',
  edit: 'e',
  prefixSubject: 'f',
  guardArchive: 'g',
  dontConfirmSubscription: 'h',
  makeWebArchive: 'i',
  dontConfirmUnsubscription: 'j',
  listSubscribers: 'l',
  moderatedList: 'm',
  allowEditTexts: 'n',
  othersRejected: 'o',
  public: 'p',
  remoteAdministration: 'r',
  moderateSubscriptions: 's',
  trailerText: 't',
  userPostsOnly: 'u'
};

// for detailed information see http://untroubled.org/ezmlm/man/man1/ezmlm-make.1.html
module.exports = function () {
  const options = {
    archived: true, // -a
    archiveBlocked: true, // -b
    digest: false, // -D
    edit: false, // -E
    prefixSubject: true, // -f
    guardArchive: true, // -g
    dontConfirmSubscription: false, // -H
    makeWebArchive: false, // -I
    dontConfirmUnsubscription: false, // -J
    listSubscribers: false, // -L
    moderatedList: false, // -M
    allowEditTexts: false, // -N
    othersRejected: false, // -O
    public: false, // -P
    remoteAdministration: false, // -R
    moderateSubscriptions: true, // -s
    trailerText: false, // -T
    userPostsOnly: true // -u
  };

  function createFlagsString() {
    return keys(options).map(key => {
      const letter = lettersForOptions[key];
      return options[key] ? letter : letter.toUpperCase();
    }).join('');
  }

  return {
    asFlags: createFlagsString,
    digest: function digest(onOff) { options.digest = onOff; },
    edit: function edit(onOff) { options.edit = onOff; },
    moderate: function moderate (onOff) {
      options.moderatedList = onOff;
      options.userPostsOnly = !onOff;
    }
  };
};
