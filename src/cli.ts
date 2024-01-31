import { run } from './index';

const idx = process.argv.findIndex((item) => item.endsWith('bin/index.js'));
const configs = process.argv[idx + 1];
const files = process.argv.slice(idx + 2);

run(configs, files);
