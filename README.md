# lfs-auto-track

If the files bigger than the size(you can configure, check the usage part), when commit, run `git lfs track` automatically.

## Usage

1. Install

```sh
npm i lfs-auto-track -D
```

2. Config

> We use `husky` and `lint-staged` to run relative code in pre-commit.

Add `lint-staged` script in `package.json`

```json
{
  "name": "module-name",
  ...
  "lint-staged": {
    "*": [
      "pnpm lfs-auto-track 'jpg,jpeg,png,gif:100;video,audio:200;*:1024'"
    ],
  }
  ...
}
```

> `'jpg,jpeg,png,gif:100;video,audio:200;*:1024'` means files with extension `jpg,jpeg,png,gif`, if size bigger than 100kb, if video/audio files size bigger than 200kb, and if any files biiger than 1024kb, these files will add to `.gitattributes` for `git lfs track`.

## Examples

- Check this repo code (`package.json` / `imgs/`)

## Some questions

- How to upload the large file?

```sh
git lfs push
```

- How to clone the project without download the large file?

```sh
GIT_LFS_SKIP_SMUDGE=1 git clone THE_REPO_URL
```

- How to fetch the large files?

```sh
git lfs fetch
```
