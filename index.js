'use strict';

const isObject = require('is-plain-object');
const unset = require('unset-value');

function isEmptyObject(obj) {
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      return false;
    }
  }
  return true;
}

module.exports = function omitDeep(value, keys, opts) {
  opts = opts || {};
  if (typeof value === 'undefined') {
    return {};
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      value[i] = omitDeep(value[i], keys);
    }
    return value;
  }

  if (!isObject(value)) {
    return value;
  }

  if (typeof keys === 'string') {
    keys = [keys];
  }

  if (!Array.isArray(keys)) {
    return value;
  }

  for (let j = 0; j < keys.length; j++) {
    unset(value, keys[j]);
  }

  for (let key in value) {
    if (value.hasOwnProperty(key)) {
      const keyIsObj = isObject(value[key]);

      if (keyIsObj && isEmptyObject(value[key])) {
        if (opts.removeEmpty) unset(value, key);
        continue;
      }

      value[key] = omitDeep(value[key], keys);

      if ((opts.cleanEmpty || opts.removeEmpty) && keyIsObj && isEmptyObject(value[key])) {
        unset(value, key);
      }
    }
  }

  return value;
};
