'use strict';
var
  _ = require('lodash'),
  path = require('path'),
  exec = require('./ezmlmExec');

module.exports = function (fullQualifiedHome, domain, customSettingsFile) {
  function dirForName(name) {
    return path.join(fullQualifiedHome, 'ezmlm/' + name);
  }

  function mailboxFileNameFor(name) {
    return path.join(fullQualifiedHome, '.qmail-' + name);
  }

  function ezmlmrc() {
    return customSettingsFile ? ' -C ' + path.join(fullQualifiedHome, customSettingsFile) : '';
  }

  function allLists(callback) {
    return exec.perform('ls' + ' ' + path.join(fullQualifiedHome, 'ezmlm/'), function (error, stdout) {
      callback(error, _.compact((stdout || '').trim().split('\n')));
    });
  }

  function createListNamed(name, options, callback) {
    options.edit(false);
    return exec.perform('ezmlm-make' + ' -' + options.asFlags() + ezmlmrc() + ' ' + dirForName(name) + ' ' + mailboxFileNameFor(name) + ' ' + name + ' ' + domain, callback);
  }

  function editListNamed(name, options, callback) {
    options.edit(true);
    return exec.perform('ezmlm-make -' + options.asFlags() + ezmlmrc() + ' ' + dirForName(name), callback);
  }

  function usersOfList(name, callback) {
    return exec.perform('ezmlm-list ' + dirForName(name), function (error, stdout) {
      callback(error, _.compact((stdout || '').trim().split('\n')));
    });
  }

  function subscribeUserToList(user, name, callback) {
    return exec.perform('ezmlm-sub ' + dirForName(name) + ' ' + user, callback);
  }

  function unsubscribeUserFromList(user, name, callback) {
    return exec.perform('ezmlm-unsub ' + dirForName(name) + ' ' + user, callback);
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
