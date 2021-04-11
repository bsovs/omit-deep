'use strict';

require('mocha');
const assert = require('assert');
const omitDeep = require('./');

describe('.omit()', function() {
  it('should return the object if it is not a plain object', function() {
    const date = new Date();
    const obj = omitDeep(date, 'foo');
    assert(obj === date);
    assert.deepEqual(obj, date);
  });

  it('should return the value if it is not a plain object', function() {
    assert.deepEqual(omitDeep('foo'), 'foo');
    assert.deepEqual(omitDeep(42), 42);
  });

  it('should omit keys using dot notation', function() {
    const obj = omitDeep({a: {b: {c: {d: {e: 'e'}, f: {g: 'g'}}}}}, 'a.b.c.d');
    assert.deepEqual(obj, {a: {b: {c: {f: {g: 'g'}}}}});
  });

  it('should omit multiple keys using dot notation', function() {
    const obj = omitDeep({a: {x: 'y', b: {c: {d: {e: 'e'}, f: {g: 'g'}}}}}, ['a.b.c.d', 'a.x']);
    assert.deepEqual(obj, {a: {b: {c: {f: {g: 'g'}}}}});
  });

  it('should recursively omit key passed as a string.', function() {
    const obj = omitDeep({a: 'a', b: 'b', c: {b: 'b', d: 'd', e: {b: 'b', f: 'f', g: {b: 'b', c: 'c'}}}}, 'b');
    assert.deepEqual(obj, {a: 'a', c: {d: 'd', e: {f: 'f', g: {c: 'c'}}}});
  });

  it('should recursively omit key passed as an array.', function() {
    const obj = omitDeep({a: 'a', b: 'b', c: {b: 'b', d: 'd', e: {b: 'b', f: 'f', g: {b: 'b', c: 'c'}}}}, ['b']);
    assert.deepEqual(obj, {a: 'a', c: {d: 'd', e: {f: 'f', g: {c: 'c'}}}});
  });

  it('should recursively omit multiple keys.', function() {
    const obj = omitDeep({a: 'a', b: 'b', c: {b: 'b', d: 'd', e: {b: 'b', f: 'f', g: {b: 'b', c: 'c'}}}}, ['b', 'd', 'f']);
    assert.deepEqual(obj, {a: 'a', c: {e: {g: {c: 'c'}}}});
  });

  it('should omit the given keys.', function() {
    assert.deepEqual(omitDeep({a: 'a', b: 'b', c: 'c'}, ['a', 'c']), { b: 'b' });
  });

  it('should return the object if no keys are specified.', function() {
    assert.deepEqual(omitDeep({a: 'a', b: 'b', c: 'c'}), {a: 'a', b: 'b', c: 'c'});
  });

  it('should return an empty object if no object is specified.', function() {
    assert.deepEqual(omitDeep(), {});
  });

  it('should return the input unchaged if not an array or an object', function() {
    assert.deepEqual(omitDeep('foo'), 'foo');
  });

  it('should omit keys from objects in arrays', function() {
    const obj = omitDeep([
      {a: 'a', b: 'b'},
      [
        {a: 'a', b: 'b'}
      ]
    ], 'b');
    assert.deepEqual(obj, [
      {a: 'a'},
      [
        {a: 'a'}
      ]
    ]);
  });

  it('should preserve arrays when not omitting objects from them', function() {
    const obj = omitDeep({
      'numbers': ['1', '2']
    }, 'nothing');

    assert.deepEqual(obj, {
      'numbers': ['1', '2']
    });
  });

  it('should delete object of empty values as a result of using the cleanEmtpy option', function() {
    const obj = { foo: { bar: 'baz' }, fizz: {} };
    omitDeep(obj, 'bar', {cleanEmpty: true});
    assert.deepEqual(obj, { fizz: {} });
  });

  it('should delete all object of empty values as a result of using the removeEmpty option', function() {
    const obj = { fuzz: {}, foo: { bar: 'baz' }, fizz: {} };
    omitDeep(obj, 'bar', {removeEmpty: true});
    assert.deepEqual(obj, {});
  });

  it('should delete all object of empty values as a result of using the removeEmpty option and cleanEmpty', function() {
    const obj = { foo: { bar: 'baz' }, fizz: {}, fuzz: { fizz: 'foo' } };
    omitDeep(obj, 'bar', {removeEmpty: true, cleanEmpty: true});
    assert.deepEqual(obj, { fuzz: { fizz: 'foo' } });
  });
});
