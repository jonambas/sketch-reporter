#! /usr/bin/env node
const path = require('path');
const meow = require('meow');
const lib = require('../lib');
// const findUp = require('find-up');

const cli = meow(
  `
  Usage
    $ sketch-reporter <command> [options...]
  
  Commands
    start          Starts the UI
    build          Builds the UI
    help           Displays this usage guide

	Options
    --files, -f    Glob to target Sketch files
    --output, -o   Where to output the build
    --help, -h     Displays this usage guide
    --version, -v  Displays version info
`,
  {
    flags: {
      help: {
        type: 'boolean',
        alias: 'h'
      },
      version: {
        type: 'boolean',
        alias: 'v'
      },
      output: {
        type: 'string',
        default: 'dist',
        alias: 'o'
      },
      files: {
        type: 'string',
        default: '/**/*.sketch',
        alias: 'f'
      }
    }
  }
);

async function run(command, flags) {
  if (flags.version) {
    cli.showVersion(1);
  }

  if (command === 'help') {
    cli.showHelp();
    process.exit(1);
  }

  const reporter = lib({
    outputPath: flags.output,
    files: flags.files
  });

  if (reporter.hasOwnProperty(command)) {
    reporter[command]((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  } else {
    cli.showHelp();
    process.exit(1);
  }
}

run(cli.input[0], cli.flags);
