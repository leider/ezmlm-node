const compact = require('lodash.compact');
const path = require('path');
const exec = require('./ezmlmExec');

function linesToArray(stdout) {
  return compact((stdout || '').trim().split('\n'));
}

module.exports = function (fullQualifiedHome, domain, listownerAddress, optionalCustomSettingsFile) {
  const modifyHeaders = require('./modifyHeaders')(fullQualifiedHome, exec);

  function dirForName(name) {
    return path.join(fullQualifiedHome, 'ezmlm', name);
  }

  function archiveDirForName(name) {
    return path.join(dirForName(name), 'archive');
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
      callback(error, compact((stdout || '').trim().split('\n')));
    });
  }

  function subscribeUserToList(user, name, callback) {
    exec.perform('ezmlm-sub ' + dirForName(name) + ' ' + user, callback);
  }

  function unsubscribeUserFromList(user, name, callback) {
    exec.perform('ezmlm-unsub ' + dirForName(name) + ' ' + user, callback);
  }

  function archivedMails(name, maxAgeInDays, callback) {
    exec.perform('find ' + archiveDirForName(name) + ' ! -name index -type f -ctime -' + maxAgeInDays, function (error, stdout) {
      callback(error, linesToArray(stdout));
    });
  }

  return {
    allLists,
    createListNamed,
    editListNamed,
    usersOfList,
    subscribeUserToList,
    unsubscribeUserFromList,
    archivedMails,
    defaultOptions: require('./flags')(),
    replyToList: modifyHeaders.replyToList,
    replyToSender: modifyHeaders.replyToSender

  };
};
