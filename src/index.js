const path = require('path');

const execa = require('execa');
const chalk = require('chalk');

const { limit } = require(path.resolve(process.cwd(), 'package.json'));

const { size, reg } = limit;

const fileLimitSize = size || 500;
const fileGrobber = new RegExp(reg || `(png|jpe?g|gif)$`, 'g');

async function getBigFiles() {
  try {
    let { stdout } = await execa('git', ['diff', '--staged', '--name-status']);
    const files = stdout.split('\n').map(item => item.split('\t')[1]);

    const bigFiles = [];
    files.forEach(async file => {
      if (fileGrobber.test(file)) {
        const { stdout } = execa.sync('du', [file]);
        if (parseInt(stdout.split('\t')[0]) > fileLimitSize) {
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
  console.log('xx');
  if (bigFiles.length > 0) {
    console.log(chalk.red(bigFiles.join('\n')));
    console.log(chalk.red('为避免cdn被干死, 压缩图片后上传'));
    process.exit(1);
  }
}

limitLint();
