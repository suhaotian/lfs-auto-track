import assert from 'node:assert';
import { describe, it } from 'node:test';

import { getLFSTrackFiles } from '../index';

describe('getLFSTrackFiles tests', () => {
  it('should work with empty config', () => {
    const cwd = '/usr/app/project/';

    const result = getLFSTrackFiles(
      '',
      ['1.jpg', '2.png', '3.jpeg'].map((item) => cwd + item),
      [],
      cwd
    );
    assert.strictEqual(result.length, 0);
  });

  it('should work with valid config', () => {
    const cwd = '/usr/app/project/';

    const result = getLFSTrackFiles(
      'jpg,jpeg,png,gif:100kb;*:1024',
      ['1.jpg', '2.png', '3.jpeg', '4.mp3'].map((item) => cwd + item),
      [],
      cwd,
      {
        [cwd + '1.jpg']: { size: 100 * 1024 },
        [cwd + '2.png']: { size: 99 * 1024 },
        [cwd + '3.text']: { size: 200 * 1024 },
        [cwd + '3.jpeg']: { size: 50 * 1024 },
        [cwd + '4.mp3']: { size: 1024 * 1024 },
      }
    );
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], '1.jpg');
    assert.strictEqual(result[1], '4.mp3');
  });

  it('should work with mimetype', () => {
    const cwd = '/usr/app/project/';

    const result = getLFSTrackFiles(
      'image:100kb;audio:200;*:1024',
      ['1.jpg', '2.png', '3.jpeg', '4.mp4', '5.mp3'].map((item) => cwd + item),
      [],
      cwd,
      {
        [cwd + '1.jpg']: { size: 100 * 1024 },
        [cwd + '2.png']: { size: 99 * 1024 },
        [cwd + '3.text']: { size: 200 * 1024 },
        [cwd + '3.jpeg']: { size: 50 * 1024 },
        [cwd + '4.mp4']: { size: 1024 * 1024 },
        [cwd + '5.mp3']: { size: 199 * 1024 },
      }
    );
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], '1.jpg');
    assert.strictEqual(result[1], '4.mp4');
  });

  it('should work with multiple mimetypes', () => {
    const cwd = '/usr/app/project/';

    const result = getLFSTrackFiles(
      'image,audio:200kb;*:1024',
      ['1.jpg', '2.png', '3.jpeg', '4.mp4', '5.mp3'].map((item) => cwd + item),
      [],
      cwd,
      {
        [cwd + '1.jpg']: { size: 200 * 1024 },
        [cwd + '2.png']: { size: 99 * 1024 },
        [cwd + '3.text']: { size: 200 * 1024 },
        [cwd + '3.jpeg']: { size: 50 * 1024 },
        [cwd + '4.mp4']: { size: 1024 * 1024 },
        [cwd + '5.mp3']: { size: 199 * 1024 },
      }
    );
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], '1.jpg');
    assert.strictEqual(result[1], '4.mp4');
  });
});
