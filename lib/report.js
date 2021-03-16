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
    let layerCount = 0;
    let externalSymbol = 0;
    let externalText = 0;
    let externalLayer = 0;
    let externalTextLayer = 0;
    let externalAny = 0;

    // Store foreign UI Kit IDs
    const foreignSymbols = file.foreignSymbols.map((item) => item.symbolID);
    const foreignTextStyles = file.foreignTextStyles.map((item) => item.do_objectID);
    const foreignLayerStyles = file.foreignLayerStyles.map((item) => item.do_objectID);

    pages.forEach((page) => {
      function countLayers(node) {
        if (node.layers) {
          node.layers.forEach((layerNode) => {
            countLayers(layerNode);
          });
        } else {
          layerCount++;
        }

        if (node.symbolID && foreignSymbols.includes(node.symbolID)) {
          externalSymbol++;
          externalAny++;
        }

        if (node.sharedStyleID && foreignTextStyles.includes(node.sharedStyleID)) {
          externalText++;
          externalTextLayer++;
          externalAny++;
        }

        if (node.sharedStyleID && foreignLayerStyles.includes(node.sharedStyleID)) {
          externalLayer++;
          externalTextLayer++;
          externalAny++;
        }
      }

      if (page && page.name !== 'Symbols') {
        countLayers(page);
      }
    });

    results[i] = {
      file: entries[i].split('/').pop(),
      externalSymbol,
      externalText,
      externalLayer,
      externalTextLayer,
      layerCount,
      externalAny,
      coverage: externalAny / layerCount,
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
