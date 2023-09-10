import * as _ from 'lodash/fp';

import { LineStatus } from '../types';

const getIndent = (depth: number): string => '  '.repeat(depth);

const stringify = (value: any, depth: number): string => {
    if (typeof value !== 'object') {
        return value;
    }
    return `{\n${Object.keys(value).map(key => `${getIndent(depth + 3)}${key}: ${value[key]}`)}\n${getIndent(depth + 1)}}`;
};

const lineStatus: Record<string, (...args: any[]) => string | string[]> = {
    added: ((key, depth, value) => `${getIndent(depth)}+ ${key}: ${stringify(value, depth)}`),
    removed: ((key, depth, value) => `${getIndent(depth)}- ${key}: ${stringify(value, depth)}`),
    notChanged: ((key, depth, value) => `${getIndent(depth)}  ${key}: ${stringify(value, depth)}`),
    changed: ((key, depth, value, valueOld, valueNew) => [
        `${getIndent(depth)}- ${key}: ${stringify(valueOld, depth)}`,
        `${getIndent(depth)}+ ${key}: ${stringify(valueNew, depth)}`,
    ]),
    parent: ((key, depth, value, valueOld, valueNew, children, getLines) => `${getIndent(depth + 1)}${key}: ${getLines(children, depth + 1)}`),
};

const repareLine = (
    item: LineStatus,
    depth: number,
    getLines: ((ast: LineStatus[], depth: number) => string) | undefined,
): string | string[] => {
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

const getLines = (ast: LineStatus[], depth = 0): string => {
    const lines = _.flatten(ast.map(item => repareLine(item, depth + 1, getLines)));
    return ['{', ...lines, `${getIndent(depth)}}`].join('\n');
};

export default getLines;
