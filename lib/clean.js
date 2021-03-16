const fs = require('fs-extra');
const chalk = require('chalk');

module.exports = (userConfig) => {
  const cwd = process.cwd();
  const { outputPath } = userConfig;

  fs.emptyDir(`${cwd}/node_modules/sketch-reporter/.data`, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log(chalk.gray('Cache cleaned'));
  });
};
