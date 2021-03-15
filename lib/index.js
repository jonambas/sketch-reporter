const start = require('./start');
// const build = require('./build');
const report = require('./report');
const clean = require('./clean');

function makeDefaultConfig(userConfig) {
  return {
    openBrowser: true,
    port: 9000,
    outputPath: userConfig.outputPath
  };
}

module.exports = function (userConfig) {
  const config = makeDefaultConfig(userConfig);

  return {
    start: async (callback) => {
      clean();
      await report(userConfig, callback);
      start(config, callback);
    },
    build: (callback) => {
      // report(config, callback);
      // build(config, callback);
    }
  };
};
