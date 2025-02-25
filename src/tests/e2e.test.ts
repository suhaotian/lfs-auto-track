import fs from 'fs/promises';
import test, { describe } from 'node:test';

import { run } from '..';

describe('e2e tests', () => {
  test('parseConditions should handle case insensitivity for units', async () => {
    await fs.writeFile('./.gitattributes', '');
    const files: string[] = [
      'imgs/dive.jpg',
      'imgs/dive3.jpg',
      'package.json',
      // 'small.txt',
      // 'large.txt',
      // 'small.jpg',
      // 'large.jpg',
    ];
    await run('image,video,audio:100kb;*:1024kb', files);
    const content = await fs.readFile('./.gitattributes', 'utf-8');
    console.log('.gitattributes content: ', content);
  });
});
