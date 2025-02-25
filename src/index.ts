import { execSync } from 'child_process';
import fs from 'fs';
import mime from 'mime';
import path from 'path';

export function parseConditions(conditions: string): { exts: string[]; size: number }[] {
  return conditions
    .split(';')
    .map((item) => {
      const [ext, sizeStr] = item.split(':');
      if (!ext || !sizeStr) {
        return { exts: [], size: 0 };
      }

      // Parse extensions
      const exts = ext
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      // Parse size with unit conversion to bytes
      let size = 0;
      const sizeMatch = sizeStr.trim().match(/^(\d+(?:\.\d+)?)\s*(kb|mb|gb|b)?$/i);

      if (sizeMatch) {
        const value = parseFloat(sizeMatch[1]);
        const unit = (sizeMatch[2] || 'kb').toLowerCase();

        switch (unit) {
          case 'b':
            size = value;
            break;
          case 'kb':
            size = value * 1024;
            break;
          case 'mb':
            size = value * 1024 * 1024;
            break;
          case 'gb':
            size = value * 1024 * 1024 * 1024;
            break;
          default:
            size = value * 1024; // Default to KB if unit is unrecognized
        }
      }

      return { exts, size };
    })
    .filter((item) => item.exts.length > 0);
}

export function getLFSTrackFiles(
  conditions: string,
  files: string[],
  gitattributesFiles: string[],
  cwd: string,
  mockFileInfo?: { [key: string]: { size: number } }
): string[] {
  const result: string[] = [];
  const cs = parseConditions(conditions);

  if (files?.length > 0 && cs.length > 0) {
    for (const filepath of files) {
      const ext = path.extname(filepath).toLowerCase().replace('.', '');

      if (ext) {
        const mimetype = mime.getType(ext);
        const extInfo = cs.find((item) =>
          item.exts.find((_ext) => {
            if (_ext === '*') return true;
            if (mimetype && ['video', 'audio', 'image'].includes(_ext)) {
              return mimetype.startsWith(_ext);
            }
            // Fixed the typo here: swapped variables in the comparison
            return ext === _ext || '.' + ext === _ext;
          })
        );

        if (extInfo) {
          const fileinfo = mockFileInfo?.[filepath] || fs.statSync(filepath);
          const filesize = fileinfo.size;
          if (process.env.DEBUG)
            console.log('filepath, extInfo.size, filesize', filepath, extInfo.size, filesize);
          if (filesize >= extInfo.size) {
            const relativePath = path.relative(cwd, filepath);
            const alreadyTrack = gitattributesFiles.find((item) => item.startsWith(relativePath));

            if (!alreadyTrack) {
              result.push(relativePath);
            }
          }
        }
      }
    }
  }

  return result;
}

export async function run(conditions: string, files: string[]) {
  const cwd = process.cwd();
  const gitattributesFiles = fs.existsSync('./.gitattributes')
    ? fs
        .readFileSync('./.gitattributes', 'utf-8')
        .split('\n')
        .filter((item) => item.trim())
    : [];

  const trackFiles = getLFSTrackFiles(conditions, files, gitattributesFiles, cwd);

  if (trackFiles.length > 0) {
    execSync(`git lfs track ${trackFiles.map((item) => `'${item}'`).join(' ')}`, {
      stdio: 'inherit',
    });
    execSync(`git add .gitattributes`, { stdio: 'inherit' });
  }
}
