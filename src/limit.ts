#!/usr/bin/env node

import execa from 'execa';
const limit: number = 5;
const imageReg = /(png|jpe?g|gif|js)$/g;

async function getBigFiles(): Promise<Array<string>> {
  try {
    let { stdout } = await execa('git', ['ls-files', '-s']);
    const files: Array<string> = stdout
      .split('\n')
      .map(item => item.split('\t')[1]);

    const bigFiles = [];
    files.forEach(async file => {
      if (imageReg.test(file)) {
        const { stdout } = execa.sync('du', [file]);
        if (parseInt(stdout.split('\t')[0]) > limit) {
          bigFiles.push(stdout);
        }
      }
    });
    return bigFiles;
  } catch (e) {
    console.log(e);
  }
}

async function limitLint() {
  let bigFiles = await getBigFiles();
  if (bigFiles.length > 0) {
    console.error(bigFiles.join('\n'));
    console.log('为避免cdn被干死, 压缩图片后上传');
  } else {
    process.exit(0);
  }
}

limitLint();
