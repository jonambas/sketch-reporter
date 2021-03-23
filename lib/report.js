const ns = require('node-sketch');
const fg = require('fast-glob');
const fs = require('fs');
const chalk = require('chalk');

let results = [];

async function report(config) {
  console.log(chalk.gray('Reading Sketch files...'));
  const entries = await fg(config.files);
  console.log(chalk.green(`${entries.length} Sketch files found`));
  const sketch = await ns.read(entries);

  sketch.forEach((file, i) => {
    const stats = fs.statSync(entries[i]);
    const pages = file.pages;

    let layers = 0;
    let externalSymbol = 0;
    let externalText = 0;
    let externalLayer = 0;
    let externalTextLayer = 0;
    let externalAny = 0;

    // Stores foreign UI Kit IDs
    // Need to check that symbol and style IDs are actually foreign
    // to differentiate from internal symbols and shared styles
    const foreignSymbols = file.foreignSymbols.map((item) => item.symbolID);
    const foreignTextStyles = file.foreignTextStyles.map((item) => item.do_objectID);
    const foreignLayerStyles = file.foreignLayerStyles.map((item) => item.do_objectID);

    function parse(node) {
      if (node.layers) {
        node.layers.forEach((layerNode) => {
          parse(layerNode);
        });
      } else {
        layers++;
      }

      // Symbol
      if (node.symbolID && foreignSymbols.includes(node.symbolID)) {
        externalSymbol++;
        externalAny++;
      }

      // Text Style
      if (node.sharedStyleID && foreignTextStyles.includes(node.sharedStyleID)) {
        externalText++;
        externalTextLayer++;
        externalAny++;
      }

      // Layer Style
      if (node.sharedStyleID && foreignLayerStyles.includes(node.sharedStyleID)) {
        externalLayer++;
        externalTextLayer++;
        externalAny++;
      }
    }

    pages.forEach((page) => {
      if (page && page.name !== 'Symbols') {
        parse(page);
      }
    });

    results[i] = {
      file: entries[i].split('/').pop(),
      externalSymbol,
      externalText,
      externalLayer,
      externalTextLayer,
      layers,
      externalAny,
      coverage: externalAny / layers,
      stats
    };
  });

  const dir = `${process.cwd()}/.sketch`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(dir + '/results.json', JSON.stringify(results), 'utf8', function (e) {
    if (e) {
      console.error(e);
    } else {
      console.log(chalk.green('Coverage calculated'));
    }
  });
}

module.exports = report;
