const getIndent = depth => '  '.repeat(depth);

const stringify = (value, depth) => {
  if (typeof value !== 'object') {
    return value;
  }
  const lines = Object.keys(value).map(key => `${getIndent(depth + 4)}${key}: ${value[key]}\n`);
  return `{\n${lines}${getIndent(depth + 2)}}`;
};

const lineStatus = {
  added: ((key, depth, value) => `+ ${key}: ${stringify(value, depth)}`),
  removed: ((key, depth, value) => `- ${key}: ${stringify(value, depth)}`),
  notChanged: ((key, depth, value) => `  ${key}: ${stringify(value, depth)}`),
  changed: ((key, depth, value, valueOld, valueNew) => [
    `- ${key}: ${stringify(valueOld, depth)}`,
    `+ ${key}: ${stringify(valueNew, depth)}`,
  ].join(`\n${getIndent(depth + 1)}`)),
  parent: ((key, depth, value, valueOld, valueNew, children, getLines) => `${getIndent(1)}${key}: {\n${getLines(children, depth + 2)}\n${getIndent(depth + 2)}}`),
};

const getLines = (nodes, depth = 0) => Object.keys(nodes).map((item) => {
  const {
    key,
    children,
    value,
    valueOld,
    valueNew,
    status,
  } = nodes[item];

  return `${getIndent(depth + 1)}${lineStatus[status](key, depth, value, valueOld, valueNew, children, getLines)}`;
}).join('\n');

export default (ast) => {
  const lines = getLines(ast);
  return `{\n${lines}\n}`;
};
