const ns = require("node-sketch");
const fg = require("fast-glob");
const fs = require("fs");

let results = [];

async function run() {
  const entries = await fg(`files/**/*.sketch`);
  const sketch = await ns.read(entries);

  sketch.forEach((file, i) => {
    const pages = file.pages;
    let layerCount = 0;
    let externalSymbol = 0;
    let externalStyle = 0;
    let externalAny = 0;

    // Store foreign UI Kit IDs
    const foreignSymbols = file.foreignSymbols.map((item) => item.symbolID);
    const foreignTextStyles = file.foreignTextStyles.map(
      (item) => item.do_objectID
    );
    const foreignLayerStyles = file.foreignLayerStyles.map(
      (item) => item.do_objectID
    );

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

        if (
          node.sharedStyleID &&
          (foreignTextStyles.includes(node.sharedStyleID) ||
            foreignLayerStyles.includes(node.sharedStyleID))
        ) {
          externalStyle++;
          externalAny++;
        }
      }

      if (page && page.name !== "Symbols") {
        countLayers(page);
      }
    });

    results[i] = {
      file: entries[i].replace("files/", "").replace(".sketch", ""),
      externalSymbol,
      externalStyle,
      layerCount,
      externalAny,
      coverage: externalAny / layerCount,
    };
  });

  const csv = results
    .map((row, i) => {
      if (i === 0) {
        return `${Object.keys(row).join(",")}\n${Object.values(row).join(",")}`;
      }
      return `${Object.values(row).join(",")}`;
    })
    .join("\n");

  fs.writeFile("results.csv", csv, "utf8", function (err) {
    if (err) {
      console.log("Error");
    } else {
      console.log("CSV saved");
    }
  });

  fs.writeFile("results.json", JSON.stringify(results), "utf8", function (err) {
    if (err) {
      console.log("Error");
    } else {
      console.log("JSON saved");
    }
  });
}

run();
