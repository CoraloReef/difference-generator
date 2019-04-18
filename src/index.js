import fs from 'fs';
import _ from 'lodash/fp';
import path from 'path';
import parsers from './parsers';

const getObjectPathFile = (pathFile) => {
  const file = fs.readFileSync(pathFile, 'utf-8');
  return parsers(path.extname(pathFile), file);
};

const getNod = (objFirstFile, objSecondFile) => {
  const keysFiles = [
    ...Object.keys(objFirstFile),
    ...Object.keys(objSecondFile)
      .filter(key => !_.has(key, objFirstFile)),
  ];

  return keysFiles.reduce((acc, key) => {
    if (!_.has(key, objFirstFile) && _.has(key, objSecondFile)) {
      return { ...acc, [key]: { value: objSecondFile[key], status: 'added' } };
    }
    if (_.has(key, objFirstFile) && !_.has(key, objSecondFile)) {
      return { ...acc, [key]: { value: objFirstFile[key], status: 'removed' } };
    }
    if (objFirstFile[key] === objSecondFile[key]) {
      return { ...acc, [key]: { value: objFirstFile[key], status: 'notChanged' } };
    }
    return { ...acc, [key]: { value: [objFirstFile[key], objSecondFile[key]], status: 'changed' } };
  }, {});
};

const render = (ast) => {
  const result = _.keys(ast).reduce((acc, key) => {
    const item = {
      added: `+ ${key}: ${ast[key].value}`,
      removed: `- ${key}: ${ast[key].value}`,
      notChanged: `  ${key}: ${ast[key].value}`,
      changed: `+ ${key}: ${ast[key].value[1]}\n  - ${key}: ${ast[key].value[0]}`,
    };
    return `${acc}  ${(item[ast[key].status])}\n`;
  }, '');
  return `{\n${result}}`;
};

const genDiff = (firstPathFile, secondPathFile) => {
  const objFirstFile = getObjectPathFile(firstPathFile);
  const objSecondFile = getObjectPathFile(secondPathFile);

  const ast = getNod(objFirstFile, objSecondFile);
  return render(ast);
};

export default genDiff;
