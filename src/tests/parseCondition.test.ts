import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { parseConditions } from '..';

describe('parseConditions tests', () => {
  test('should work with empty config', () => {
    const result = parseConditions('');
    assert.strictEqual(result.length, 0);
  });
  test('should work with valid config', () => {
    const result = parseConditions('jpg,jpeg,png,gif:100kb;*:1024b');
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].exts.length, 4);
    assert.strictEqual(result[0].exts.join(','), 'jpg,jpeg,png,gif');
    assert.strictEqual(result[0].size, 100 * 1024);
    assert.strictEqual(result[1].exts.length, 1);
    assert.strictEqual(result[1].size, 1024);
  });

  test('parseConditions should parse basic conditions with KB as default', () => {
    const input = 'jpg,png:100; gif:200';
    const result = parseConditions(input);

    assert.deepStrictEqual(result, [
      { exts: ['jpg', 'png'], size: 102400 },
      { exts: ['gif'], size: 204800 },
    ]);
  });

  test('parseConditions should handle explicit KB unit', () => {
    const input = 'jpg:50kb; png:10KB';
    const result = parseConditions(input);

    assert.deepStrictEqual(result, [
      { exts: ['jpg'], size: 51200 },
      { exts: ['png'], size: 10240 },
    ]);
  });

  test('parseConditions should handle MB unit', () => {
    const input = 'doc,docx:2mb; pdf:1MB';
    const result = parseConditions(input);

    assert.deepStrictEqual(result, [
      { exts: ['doc', 'docx'], size: 2 * 1024 * 1024 },
      { exts: ['pdf'], size: 1 * 1024 * 1024 },
    ]);
  });

  test('parseConditions should handle GB unit', () => {
    const input = 'iso:1gb; zip:0.5GB';
    const result = parseConditions(input);

    assert.deepStrictEqual(result, [
      { exts: ['iso'], size: 1 * 1024 * 1024 * 1024 },
      { exts: ['zip'], size: 0.5 * 1024 * 1024 * 1024 },
    ]);
  });

  test('parseConditions should handle byte unit', () => {
    const input = 'txt:1024b; json:512B';
    const result = parseConditions(input);

    assert.deepStrictEqual(result, [
      { exts: ['txt'], size: 1024 },
      { exts: ['json'], size: 512 },
    ]);
  });

  test('parseConditions should handle decimal values', () => {
    const input = 'mp3:1.5mb; mp4:0.25gb';
    const result = parseConditions(input);

    assert.deepStrictEqual(result, [
      { exts: ['mp3'], size: 1.5 * 1024 * 1024 },
      { exts: ['mp4'], size: 0.25 * 1024 * 1024 * 1024 },
    ]);
  });

  test('parseConditions should handle whitespace in conditions', () => {
    const input = ' jpg , png : 100 ; gif : 200kb ';
    const result = parseConditions(input);

    assert.deepStrictEqual(result, [
      { exts: ['jpg', 'png'], size: 102400 },
      { exts: ['gif'], size: 204800 },
    ]);
  });

  test('parseConditions should filter out invalid conditions', () => {
    const input = 'jpg:100; :200; gif:; invalid';
    const result = parseConditions(input);

    assert.deepStrictEqual(result, [{ exts: ['jpg'], size: 102400 }]);
  });

  test('parseConditions should handle mixed units in the same input', () => {
    const input = 'jpg:500kb; png:0.5mb; pdf:0.001gb; txt:1024b';
    const result = parseConditions(input);

    assert.deepStrictEqual(result, [
      { exts: ['jpg'], size: 500 * 1024 },
      { exts: ['png'], size: 0.5 * 1024 * 1024 },
      { exts: ['pdf'], size: 0.001 * 1024 * 1024 * 1024 },
      { exts: ['txt'], size: 1024 },
    ]);
  });

  test('parseConditions should return an empty array for empty input', () => {
    const input = '';
    const result = parseConditions(input);

    assert.deepStrictEqual(result, []);
  });

  test('parseConditions should handle case insensitivity for units', () => {
    const input = 'jpg:10KB; png:5Mb; gif:0.1Gb';
    const result = parseConditions(input);

    assert.deepStrictEqual(result, [
      { exts: ['jpg'], size: 10 * 1024 },
      { exts: ['png'], size: 5 * 1024 * 1024 },
      { exts: ['gif'], size: 0.1 * 1024 * 1024 * 1024 },
    ]);
  });
});
