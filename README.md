# [LFS Auto Track](https://npmjs.org/package/lfs-auto-track) &middot; ![Window E2E Tests](https://github.com/suhaotian/lfs-auto-track/actions/workflows/windows.e2e-test.yml/badge.svg)![Linux E2E Tests](https://github.com/suhaotian/lfs-auto-track/actions/workflows/linux.e2e-test.yml/badge.svg)

# lfs-auto-track

If the files bigger than the size (you can configure, check the usage part), when commit, automatically run `git lfs track` files.

## Usage

### Step 0: prepare

make sure use `husky` and `lint-staged` in the project, and run `git lfs install`

### Step 1: install

```sh
npm i lfs-auto-track -D
```

### Step 2: Configure

Add `lint-staged` script in `package.json`

```json
{
  "name": "module-name",
  ...
  "lint-staged": {
    "*": [
      "lfs-auto-track 'image,video,audio:100;*:1024'"
    ],
  }
  ...
}
```

### Configuration means

> `'image,video,audio:100;*:1024'` means if mimetype is image/video/audio files's size bigger than 100 KB, and others files bigger than 1024 KB, these files will add to `.gitattributes` with run command `git lfs track` automatically;

> `'*:1024'` means any files size bigger than 1024 KB when commit, these files will add to `.gitattributes` with run command `git lfs track` automatically;

> `'jpg,png,gif:1024'` means files with extension `jpg` or `png` or `gif` size bigger than 1024 KB when commit, these files will add to `.gitattributes` with run command `git lfs track` automatically.

### Examples

- Check the repo source code (`package.json` / `imgs/`) [This file should be store in LFS](https://github.com/suhaotian/lfs-auto-track/blob/main/imgs/dive.jpg)

### Some questions

- How to upload the large file after track?

```sh
git lfs push --all origin
```

- How to clone the project without download the large file?

```sh
GIT_LFS_SKIP_SMUDGE=1 git clone THE_REPO_URL
```

- How to download the large files?

```sh
git lfs pull
```
