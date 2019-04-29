import fs from 'fs';
import _ from 'lodash/fp';
import path from 'path';
import render from './formatters';
import parsers from './parsers';

const getObjectPathFile = (pathFile) => {
  const fileContent = fs.readFileSync(pathFile, 'utf-8');
  return parsers(path.extname(pathFile), fileContent);
};

const getAst = (objFirst, objSecond) => {
  const objKeys = [
    ...Object.keys(objFirst),
    ...Object.keys(objSecond)
      .filter(key => !_.has(key, objFirst)),
  ].sort();

  return objKeys.reduce((acc, key) => {
    const valueFirst = objFirst[key];
    const valueSecond = objSecond[key];

    if (_.has(key, objFirst) && _.has(key, objSecond)) {
      if (valueFirst === valueSecond) {
        return { ...acc, [key]: { value: valueFirst, status: 'notChanged' } };
      }
      if (typeof valueFirst === 'object' && typeof valueSecond === 'object') {
        return { ...acc, [key]: { children: getAst(valueFirst, valueSecond) } };
      }
      return { ...acc, [key]: { value: { old: valueFirst, new: valueSecond }, status: 'changed' } };
    }
    if (!_.has(key, objFirst) && _.has(key, objSecond)) {
      return { ...acc, [key]: { value: valueSecond, status: 'added' } };
    }

    return { ...acc, [key]: { value: valueFirst, status: 'removed' } };
  }, {});
};

export default (firstPathFile, secondPathFile, outputFormat = 'cascade') => {
  const objFirst = getObjectPathFile(firstPathFile);
  const objSecond = getObjectPathFile(secondPathFile);
  const ast = getAst(objFirst, objSecond);
  return render(ast, outputFormat);
};
