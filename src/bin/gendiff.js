#!/usr/bin/env node

import commander from 'commander';
import info from '../../package.json';

const program = commander;

program
  .version(info.version)
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv);



console.log('Welcome to the Difference Calculator');
