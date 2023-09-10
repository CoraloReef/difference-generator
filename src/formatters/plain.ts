const repareValue = (value: unknown): string | {} | undefined => {
    if (typeof value === 'object') {
        return '[complex value]';
    }
    if (typeof value === 'string') {
        return `'${value}'`;
    }
    return value;
};

const repareParent = (parent: string): string => (parent ? `${parent}.` : '');

type LineStatus = {
    key: string;
    status: string;
    value: unknown;
    valueOld?: unknown;
    valueNew?: unknown;
    children?: Record<string, unknown>[];
};

const getLines = (nodes: Record<string, unknown>[], parent: string): string[] => nodes.map((item) => {
    const {
        key,
        children,
        value,
        valueOld,
        valueNew,
        status,
    } = item as LineStatus;

    return lineStatus[status](key, parent, value, valueOld, valueNew, children as Record<string, unknown>[]);
}).filter(Boolean);

const lineStatus: Record<string, (key: string, parent: string, value: unknown, valueOld?: unknown, valueNew?: unknown, children?: Record<string, unknown>[]) => string> = {
    added: (key, parent, value) => `Property '${repareParent(parent)}${key}' was added with value: ${repareValue(value)}`,
    removed: (key, parent) => `Property '${repareParent(parent)}${key}' was removed`,
    changed: (key, parent, value, valueOld, valueNew) => `Property '${repareParent(parent)}${key}' was updated. From ${repareValue(valueOld)} to ${repareValue(valueNew)}`,
    notChanged: () => '',
    parent: (key, parent, value, valueOld, valueNew, children) => getLines(children || [], `${repareParent(parent)}${key}`).join('\n'),
};

export default (ast: LineStatus[]): string => {
    const lines = getLines(ast, '');
    return lines.join('\n');
};
