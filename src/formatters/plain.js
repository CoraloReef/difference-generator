const repareValue = (value) => {
  if (typeof value === 'object') {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};
const repareParent = parent => (parent ? `${parent}.` : '');

const lineStatus = {
  added: ((key, parent, value) => `Property '${repareParent(parent)}${key}' was added with value: ${repareValue(value)}`),
  removed: ((key, parent) => `Property '${repareParent(parent)}${key}' was removed`),
  changed: ((key, parent, value, valueOld, valueNew) => `Property '${repareParent(parent)}${key}' was updated. From ${repareValue(valueOld)} to ${repareValue(valueNew)}`),
  notChanged: (() => null),
  parent: ((key, parent, value, valueOld, valueNew, children, getLines) => `${getLines(children, `${repareParent(parent)}${key}`).join('\n')}`),
};

const getLines = (nodes, parent) => Object.keys(nodes).map((item) => {
  const {
    key,
    children,
    value,
    valueOld,
    valueNew,
    status,
  } = nodes[item];

  return lineStatus[status](key, parent, value, valueOld, valueNew, children, getLines);
}).filter(x => x);

export default (ast) => {
  const lines = getLines(ast).join('\n');
  return lines;
};
