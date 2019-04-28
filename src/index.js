import fs from 'fs';
import _ from 'lodash/fp';
import path from 'path';
import render from './formatters';
import parsers from './parsers';

const getObjectPathFile = (pathFile) => {
  const file = fs.readFileSync(pathFile, 'utf-8');
  return parsers(path.extname(pathFile), file);
};

const getAst = (objFirstFile, objSecondFile) => {
  const keysFiles = [
    ...Object.keys(objFirstFile),
    ...Object.keys(objSecondFile)
      .filter(key => !_.has(key, objFirstFile)),
  ].sort();

  return keysFiles.reduce((acc, key) => {
    const valueFirst = objFirstFile[key];
    const valueSecond = objSecondFile[key];

    if (_.has(key, objFirstFile) && _.has(key, objSecondFile)) {
      if (valueFirst === valueSecond) {
        return { ...acc, [key]: { value: valueFirst, status: 'notChanged' } };
      }
      if (typeof valueFirst === 'object' && typeof valueSecond === 'object') {
        return { ...acc, [key]: { children: getAst(valueFirst, valueSecond) } };
      }
      return { ...acc, [key]: { value: { old: valueFirst, new: valueSecond }, status: 'changed' } };
    }
    if (!_.has(key, objFirstFile) && _.has(key, objSecondFile)) {
      return { ...acc, [key]: { value: valueSecond, status: 'added' } };
    }

    return { ...acc, [key]: { value: valueFirst, status: 'removed' } };
  }, {});
};

export default (firstPathFile, secondPathFile, outputFormat = 'cascade') => {
  const objFirstFile = getObjectPathFile(firstPathFile);
  const objSecondFile = getObjectPathFile(secondPathFile);
  const ast = getAst(objFirstFile, objSecondFile);
  return render(ast, outputFormat);
};
