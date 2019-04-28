import _ from 'lodash/fp';

const getIndent = depth => '  '.repeat(depth);

const stringify = (value, depth) => {
  if (typeof value === 'object') {
    const lines = Object.keys(value).map(key => `${getIndent(depth + 4)}${key}: ${value[key]}\n`);
    return `{\n${lines}${getIndent(depth + 2)}}`;
  }
  return value;
};

export default (ast) => {
  const getLines = (nodes, depth = 0) => Object.keys(nodes).map((key) => {
    const { children, value, status } = nodes[key];

    if (children !== undefined) {
      return `${getIndent(depth + 2)}${key}: {\n${_.flatten(getLines(children, depth + 2)).join('\n')}\n${getIndent(depth + 2)}}`;
    }

    const line = {
      added: `+ ${key}: ${stringify(value, depth)}`,
      removed: `- ${key}: ${stringify(value, depth)}`,
      notChanged: `  ${key}: ${stringify(value, depth)}`,
      changed: [`- ${key}: ${stringify(value.old, depth)}`, `+ ${key}: ${stringify(value.new, depth)}`]
        .join(`\n${getIndent(depth + 1)}`),
    };
    return `${getIndent(depth + 1)}${line[status]}`;
  });

  const lines = _.flatten(getLines(ast)).join('\n');
  return `{\n${lines}\n}`;
};
