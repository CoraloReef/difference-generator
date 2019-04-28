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

export default (ast) => {
  const getLines = (nodes, parent) => Object.keys(nodes).map((key) => {
    const { children, value, status } = nodes[key];

    if (children !== undefined) {
      return `${getLines(children, `${repareParent(parent)}${key}`).join('\n')}`;
    }

    const line = {
      added: `Property '${repareParent(parent)}${key}' was added with value: ${repareValue(value)}`,
      removed: `Property '${repareParent(parent)}${key}' was removed`,
      notChanged: '',
      changed: `Property '${repareParent(parent)}${key}' was updated. From ${repareValue(value.old)} to ${repareValue(value.new)}`,
    };
    return line[status];
  }).filter(x => x);

  const lines = getLines(ast).join('\n');
  return lines;
};
