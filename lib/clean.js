const fs = require('fs-extra');
const chalk = require('chalk');

module.exports = (userConfig) => {
  const cwd = process.cwd();

  fs.emptyDir(`${cwd}/.sketch`, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log(chalk.gray('Cache cleaned'));
  });
};
