'use strict';

var checkListName, exec, list, make, mkdirp, path, sub, unsub, _exec, _getDir, _getType, _unSub;

path = require("path");

mkdirp = require("mkdirp");

exec = require("child_process").exec;

checkListName = function (o) {
  if (typeof (o !== null ? o.name : undefined) !== "string" || (o.name.length < 1)) {
    throw new Error("Invalid list name");
  }
};

_getDir = function (cfg) {
  return path.resolve(cfg.dir || path.join("./", cfg.name));
};

_getType = function (cfg) {
  if (cfg.type) {
    return " " + cfg.type;
  }
  return '';
};

_exec = function (cmd, cb) {
  if (typeof cb === "function") {
    return exec(cmd, cb);
  }
  return cmd;
};

_unSub = function (cfg, cb, t) {
  var a, addrs, s;
  checkListName(cfg);
  s = cfg.addresses;
  if (!(s instanceof Array)) {
    throw new Error("Invalid list of addresses");
  }
  if (s.length === 0) {
    return typeof cb === "function" ? cb() : undefined;
  }
  addrs = (function () {
    var _i, _len, _ref, _results;
    _ref = s.filter(function (e) {
      return typeof e === "string";
    });
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i = _i + 1) {
      a = _ref[_i];
      _results.push(a.trim());
    }
    return _results;
  }());
  return _exec("ezmlm-" + t + " " + _getDir(cfg) + _getType(cfg) + " " + addrs.join(' '), cb);
};

make = function (cfg, cb) {
  var args, config, d, dir, domain, from, modify, name, owner, qmail, switches;
  checkListName(cfg);
  d = cfg.domain;
  if (typeof d !== "string" || d.length < 1) {
    throw new Error("Invalid domain: " + d);
  }
  name = cfg.name;
  domain = cfg.domain;
  qmail = cfg.qmail;
  config = cfg.config;
  owner = cfg.owner;
  from = cfg.from;
  switches = cfg.switches;
  modify = cfg.modify;
  if (qmail === null) {
    qmail = ".qmail-" + name;
  }
  qmail = path.resolve(qmail);
  dir = _getDir(cfg);
  switches = switches ? "-" + switches + " " : '';
  config = config ? "-C " + (path.resolve(config)) + " " : '';
  owner = owner ? "-5 " + owner + " " : '';
  from = from ? "-3 " + from + " " : '';
  modify = modify ? "-+ " : '';
  args = ''.concat(config, owner, from, switches);
  if (typeof cb === "function") {
    mkdirp.sync(path.resolve(path.join(dir, '..')));
  }
  return _exec("ezmlm-make " + modify + args + dir + " " + qmail + " " + name + " " + domain, cb);
};

list = function (cfg, cb) {
  var _cb;
  checkListName(cfg);
  if (typeof cb === "function") {
    _cb = function (err, res) {
      var a;
      if (err) {
        return cb(err);
      }
      a = res.trim().split('\n');
      if (a.length === 1 && a[0] === '') {
        a = [];
      }
      return cb(null, a);
    };
  }
  return _exec("ezmlm-list " + (_getDir(cfg)) + (_getType(cfg)), _cb);
};

sub = function (cfg, cb) {
  return _unSub(cfg, cb, "sub");
};

unsub = function (cfg, cb) {
  return _unSub(cfg, cb, "unsub");
};

module.exports = {
  make: make,
  list: list,
  sub: sub,
  unsub: unsub,
  _getDir: _getDir
};

