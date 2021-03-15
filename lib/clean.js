var fs = require('fs');
const chalk = require('chalk');

module.exports = () => {
  const cwd = process.cwd();
  try {
    if (fs.existsSync(`${cwd}/node_modules/sketch-reporter/.data/results.json`)) {
      fs.unlinkSync(`${cwd}/node_modules/sketch-reporter/.data/results.json`);
    }
  } catch (e) {
    console.error(e);
  }
  console.log(chalk.gray('Cache cleaned'));
};
