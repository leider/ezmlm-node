'use strict';
var
  _ = require('lodash'),
  path = require('path'),
  exec = require('./ezmlmExec');

module.exports = function (fullQualifiedHome, domain, customSettingsFile) {
  function dirForName(name) {
    return path.join(fullQualifiedHome, 'ezmlm', name);
  }

  function pathToPrefixFile(name) {
    return path.join(dirForName(name), '/prefix');
  }

  function mailboxFileNameFor(name) {
    return path.join(fullQualifiedHome, '.qmail-' + name);
  }

  function ezmlmrc() {
    return customSettingsFile ? ' -C ' + path.join(fullQualifiedHome, customSettingsFile) : '';
  }

  function allLists(callback) {
    exec.perform('ls' + ' ' + path.join(fullQualifiedHome, 'ezmlm/'), function (error, stdout) {
      callback(error, _.compact((stdout || '').trim().split('\n')));
    });
  }

  function createListNamed(name, options, prefix, callback) {
    options.edit(false);
    exec.perform('ezmlm-make' + ' -' + options.asFlags() + ezmlmrc() + ' ' + dirForName(name) + ' ' + mailboxFileNameFor(name) + ' ' + name + ' ' + domain, function () {
      exec.perform('> ' + pathToPrefixFile(name) + ' && echo "' + prefix + '" >> ' + pathToPrefixFile(name), callback);
    });
  }

  function editListNamed(name, options, prefix, callback) {
    options.edit(true);
    exec.perform('ezmlm-make -' + options.asFlags() + ezmlmrc() + ' ' + dirForName(name), function () {
      exec.perform('> ' + pathToPrefixFile(name) + ' && echo "' + prefix + '" >> ' + pathToPrefixFile(name), callback);
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

  return {
    allLists: allLists,
    createListNamed: createListNamed,
    editListNamed: editListNamed,
    usersOfList: usersOfList,
    subscribeUserToList: subscribeUserToList,
    unsubscribeUserFromList: unsubscribeUserFromList,
    defaultOptions: require('./flags')()
  };
};
