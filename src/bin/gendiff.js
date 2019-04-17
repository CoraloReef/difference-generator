#!/usr/bin/env node

import commander from 'commander';
import fs from 'fs';
import { has } from 'lodash/fp';
import info from '../../package.json';

const getObjectPathFile = (pathFile) => {
  const file = fs.readFileSync(pathFile, 'utf-8');
  return JSON.parse(file);
};

const genDiff = (firstPathFile, secondPathFile) => {
  const objFirstFile = getObjectPathFile(firstPathFile);
  const objSecondFile = getObjectPathFile(secondPathFile);

  const keysFiles = [
    ...Object.keys(objFirstFile),
    ...Object.keys(objSecondFile)
      .filter(key => !has(key, objFirstFile)),
  ];

  const difference = keysFiles.reduce((acc, key) => {
    if (!has(key, objFirstFile) && has(key, objSecondFile)) {
      return `${acc}  + ${key}: ${objSecondFile[key]}\n`;
    }
    if (has(key, objFirstFile) && !has(key, objSecondFile)) {
      return `${acc}  - ${key}: ${objFirstFile[key]}\n`;
    }
    if (objFirstFile[key] === objSecondFile[key]) {
      return `${acc}    ${key}: ${objFirstFile[key]}\n`;
    }
    return `${acc}  + ${key}: ${objSecondFile[key]}\n  - ${key}: ${objFirstFile[key]}\n`;
  }, '');

  return `{\n${difference}}`;
};

const program = commander;

program
  .version(info.version)
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action((firstConfig, secondConfig) => {
    console.log(genDiff(firstConfig, secondConfig));
  })
  .parse(process.argv);

export default genDiff;
