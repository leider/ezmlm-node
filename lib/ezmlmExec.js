const exec = require('child_process').exec;

function perform(commandline, callback) {
  return exec(commandline, callback);
}

module.exports = {perform};
