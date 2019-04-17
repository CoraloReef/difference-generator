#!/usr/bin/env node

import commander from 'commander';
import fs from 'fs';
import _ from 'lodash/fp';
import path from 'path';
import info from '../../package.json';
import parsers from '../parsers';

const getObjectPathFile = (pathFile) => {
  const file = fs.readFileSync(pathFile, 'utf-8');
  return parsers(path.extname(pathFile), file);
};

const genDiff = (firstPathFile, secondPathFile) => {
  const objFirstFile = getObjectPathFile(firstPathFile);
  const objSecondFile = getObjectPathFile(secondPathFile);

  const keysFiles = [
    ...Object.keys(objFirstFile),
    ...Object.keys(objSecondFile)
      .filter(key => !_.has(key, objFirstFile)),
  ];

  const difference = keysFiles.reduce((acc, key) => {
    if (!_.has(key, objFirstFile) && _.has(key, objSecondFile)) {
      return `${acc}  + ${key}: ${objSecondFile[key]}\n`;
    }
    if (_.has(key, objFirstFile) && !_.has(key, objSecondFile)) {
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
