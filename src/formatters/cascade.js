import _ from 'lodash/fp';

const getIndent = depth => '  '.repeat(depth);

const stringify = (value, depth) => {
  if (typeof value !== 'object') {
    return value;
  }
  return `{\n${Object.keys(value).map(key => `${getIndent(depth + 3)}${key}: ${value[key]}`)}\n${getIndent(depth + 1)}}`;
};

const lineStatus = {
  added: ((key, depth, value) => `${getIndent(depth)}+ ${key}: ${stringify(value, depth)}`),
  removed: ((key, depth, value) => `${getIndent(depth)}- ${key}: ${stringify(value, depth)}`),
  notChanged: ((key, depth, value) => `${getIndent(depth)}  ${key}: ${stringify(value, depth)}`),
  changed: ((key, depth, value, valueOld, valueNew) => [
    `${getIndent(depth)}- ${key}: ${stringify(valueOld, depth)}`,
    `${getIndent(depth)}+ ${key}: ${stringify(valueNew, depth)}`,
  ]),
  parent: ((key, depth, value, valueOld, valueNew, children, getLines) => `${getIndent(depth + 1)}${key}: ${getLines(children, depth + 1)}`),
};

const repareLine = (item, depth, getLines) => {
  const {
    key,
    children,
    value,
    valueOld,
    valueNew,
    status,
  } = item;

  return lineStatus[status](key, depth, value, valueOld, valueNew, children, getLines);
};

const getLines = (ast, depth = 0) => {
  const lines = _.flatten(ast.map(item => repareLine(item, depth + 1, getLines)));
  return ['{', ...lines, `${getIndent(depth)}}`].join('\n');
};

export default getLines;
