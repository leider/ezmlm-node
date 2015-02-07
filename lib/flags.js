'use strict';
var _ = require('lodash'),
  lettersForOptions = {
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
  var options = {
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
    moderateSubscriptions: false, // -S
    trailerText: false, // -T
    userPostsOnly: true // -u
  };

  function createFlagsString() {
    return _(options).keys().collect(function (key) {
      var letter = lettersForOptions[key];
      return options[key] ? letter : letter.toUpperCase();
    }).join('');
  }

  return {
    asFlags: createFlagsString,
    digest: function (onOff) { options.digest = onOff; },
    edit: function (onOff) { options.edit = onOff; },
    moderate: function (onOff) { options.moderatedList = onOff; }
  };
};
