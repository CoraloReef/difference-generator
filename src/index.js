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
  const objKeys = _.union(Object.keys(objFirst), Object.keys(objSecond)).sort();

  return objKeys.map((key) => {
    const valueFirst = objFirst[key];
    const valueSecond = objSecond[key];

    if (_.has(key, objFirst) && _.has(key, objSecond)) {
      if (valueFirst === valueSecond) {
        return {
          key,
          status: 'notChanged',
          value: valueFirst,
        };
      }
      if (typeof valueFirst === 'object' && typeof valueSecond === 'object') {
        return {
          key,
          status: 'parent',
          children: getAst(valueFirst, valueSecond),
        };
      }
      return {
        key,
        status: 'changed',
        valueOld: valueFirst,
        valueNew: valueSecond,
      };
    }
    if (!_.has(key, objFirst) && _.has(key, objSecond)) {
      return {
        key,
        status: 'added',
        value: valueSecond,
      };
    }
    return {
      key,
      status: 'removed',
      value: valueFirst,
    };
  });
};

export default (firstPathFile, secondPathFile, outputFormat = 'cascade') => {
  const objFirst = getObjectPathFile(firstPathFile);
  const objSecond = getObjectPathFile(secondPathFile);
  const ast = getAst(objFirst, objSecond);
  return render(ast, outputFormat);
};
