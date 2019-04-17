import fs from 'fs';
import _ from 'lodash/fp';
import path from 'path';
import parsers from './parsers';

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

export default genDiff;
