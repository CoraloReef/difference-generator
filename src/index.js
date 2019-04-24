import fs from 'fs';
import _ from 'lodash/fp';
import path from 'path';
import parsers from './parsers';

const getObjectPathFile = (pathFile) => {
  const file = fs.readFileSync(pathFile, 'utf-8');
  return parsers(path.extname(pathFile), file);
};

const getIndent = depth => '  '.repeat(depth);

const stringify = (value, depth) => {
  if (typeof value === 'object') {
    const lines = Object.keys(value).reduce((acc, key) => [...acc, `${getIndent(depth + 4)}${key}: ${value[key]}`], []);
    return `{\n${lines.join('\n')}\n${getIndent(depth + 2)}}`;
  }
  return value;
};

const getAst = (objFirstFile, objSecondFile) => {
  const keysFiles = [
    ...Object.keys(objFirstFile),
    ...Object.keys(objSecondFile)
      .filter(key => !_.has(key, objFirstFile)),
  ];

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

const render = (ast, depth = 2) => {
  const lines = _.keys(ast).reduce((acc, key) => {
    const { children, value, status } = ast[key];

    if (children !== undefined) {
      return [...acc, `${getIndent(depth)}${key}: ${render(children)}`];
    }

    const item = {
      added: `+ ${key}: ${stringify(value, depth)}`,
      removed: `- ${key}: ${stringify(value, depth)}`,
      notChanged: `  ${key}: ${stringify(value, depth)}`,
      changed: `+ ${key}: ${stringify(value.new, depth)}\n${getIndent(depth + 1)}- ${key}: ${stringify(value.old, depth)}`,
    };
    return [...acc, `${getIndent(depth + 1)}${item[status]}`];
  }, []);
  return _.flatten(['{', ...lines, '}']).join('\n');
};

const genDiff = (firstPathFile, secondPathFile) => {
  const objFirstFile = getObjectPathFile(firstPathFile);
  const objSecondFile = getObjectPathFile(secondPathFile);
  const ast = getAst(objFirstFile, objSecondFile);
  return render(ast);
};

export default genDiff;
