import fss from 'fs';
import fs from 'fs/promises';
import test, { describe } from 'node:test';

import { run } from '..';

describe('e2e tests', () => {
  test('parseConditions should handle case insensitivity for units', async () => {
    await fs.writeFile('./.gitattributes', '');
    const isSmallTxtExists = fss.existsSync('small.txt');
    const files: string[] = isSmallTxtExists
      ? [
          'imgs/dive.jpg',
          'imgs/dive3.jpg',
          'package.json',
          'small.txt',
          'large.txt',
          'small.jpg',
          'large.jpg',
        ]
      : ['imgs/dive.jpg', 'imgs/dive3.jpg', 'package.json'];
    const result = await run('image,video,audio:100kb;*:1024kb', files);
    console.log('run() result: ');
    console.log(result);
    const content = await fs.readFile('./.gitattributes', 'utf-8');
    console.log('.gitattributes content: ');
    console.log(content);
  });
});
