import { LineStatus } from '../types';

const getIndent = (depth: number): string => '  '.repeat(depth);

const stringify = (value: any, depth: number): string => {
    if (typeof value !== 'object') {
        return value;
    }
    return `{\n${Object.keys(value).map(key => `${getIndent(depth + 3)}${key}: ${value[key]}`)}\n${getIndent(depth + 1)}}`;
};

const lineStatus: Record<string, (...args: any[]) => string> = {
    added: (key, depth, value) => `${getIndent(depth)}+ ${key}: ${stringify(value, depth)}`,
    removed: (key, depth, value) => `${getIndent(depth)}- ${key}: ${stringify(value, depth)}`,
    notChanged: (key, depth, value) => `${getIndent(depth)}  ${key}: ${stringify(value, depth)}`,
    changed: (key, depth, value, valueOld, valueNew) => {
        const oldValue = stringify(valueOld, depth + 1);
        const newValue = stringify(valueNew, depth + 1);
        return [
            `${getIndent(depth)}- ${key}: ${oldValue}`,
            `${getIndent(depth)}+ ${key}: ${newValue}`,
        ].join('\n');
    },
    parent: ((key, depth, value, valueOld, valueNew, children, getLines) => `${getIndent(depth + 1)}${key}: ${getLines(children, depth + 1)}`),
};

const repareLine = (item: LineStatus, depth: number, getLines: ((ast: LineStatus[], depth: number) => string) | undefined): string => {
    const {
        key,
        children,
        value,
        valueOld,
        valueNew,
        status,
    } = item;

    const handler = lineStatus[status];
    if (handler) {
        if (status === 'parent') {
            return handler(key, depth, value, valueOld, valueNew, children, getLines);
        } else {
            return handler(key, depth, value, valueOld, valueNew);
        }
    }

    return '';
};

const getLines = (ast: LineStatus[], depth = 0): string => {
    const lines = ast.map((item) => repareLine(item, depth + 1, getLines as ((ast: LineStatus[], depth: number) => string) | undefined));
    return ['{', ...lines, `${getIndent(depth)}}`].join('\n');
};

export default getLines;
