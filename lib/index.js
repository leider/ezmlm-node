'use strict';
var
  _ = require('lodash'),
  path = require('path'),
  exec = require('./ezmlmExec');

function linesToArray(stdout) {
  return _.compact((stdout || '').trim().split('\n'));
}
module.exports = function (fullQualifiedHome, domain, listownerAddress, optionalCustomSettingsFile) {
  function dirForName(name) {
    return path.join(fullQualifiedHome, 'ezmlm', name);
  }

  function archiveDirForName(name) {
    return path.join(fullQualifiedHome, 'ezmlm', name, 'archive');
  }

  function pathToPrefixFile(name) {
    return path.join(dirForName(name), '/prefix');
  }

  function mailboxFileNameFor(name) {
    return path.join(fullQualifiedHome, '.qmail-' + name);
  }

  function ezmlmrc() {
    return optionalCustomSettingsFile ? ' -C ' + path.join(fullQualifiedHome, optionalCustomSettingsFile) : '';
  }

  function allLists(callback) {
    exec.perform('ls' + ' ' + path.join(fullQualifiedHome, 'ezmlm/'), function (error, stdout) {
      callback(error, linesToArray(stdout));
    });
  }

  function createListNamed(name, options, prefix, callback) {
    options.edit(false);
    exec.perform('ezmlm-make -5 ' + listownerAddress + ' -' + options.asFlags() + ezmlmrc() + ' ' + dirForName(name) + ' ' + mailboxFileNameFor(name) + ' ' + name + ' ' + domain, function (error) {
      if (error) { return callback(error); }
      exec.perform('echo "[' + prefix + ']" > ' + pathToPrefixFile(name), callback);
    });
  }

  function editListNamed(name, options, prefix, callback) {
    options.edit(true);
    exec.perform('ezmlm-make -5 ' + listownerAddress + ' -' + options.asFlags() + ezmlmrc() + ' ' + dirForName(name), function (error) {
      if (error) { return callback(error); }
      exec.perform('echo "[' + prefix + ']" > ' + pathToPrefixFile(name), callback);
    });
  }

  function usersOfList(name, callback) {
    exec.perform('ezmlm-list ' + dirForName(name), function (error, stdout) {
      callback(error, _.compact((stdout || '').trim().split('\n')));
    });
  }

  function subscribeUserToList(user, name, callback) {
    exec.perform('ezmlm-sub ' + dirForName(name) + ' ' + user, callback);
  }

  function unsubscribeUserFromList(user, name, callback) {
    exec.perform('ezmlm-unsub ' + dirForName(name) + ' ' + user, callback);
  }

  function archivedMails(name, maxAgeInDays, callback) {
    exec.perform('find ' + archiveDirForName(name) + ' ! -name index -ctime -' + maxAgeInDays, function (error, stdout) {
      callback(error, linesToArray(stdout));
    });
  }

  return {
    allLists: allLists,
    createListNamed: createListNamed,
    editListNamed: editListNamed,
    usersOfList: usersOfList,
    subscribeUserToList: subscribeUserToList,
    unsubscribeUserFromList: unsubscribeUserFromList,
    archivedMails: archivedMails,
    defaultOptions: require('./flags')()
  };
};
