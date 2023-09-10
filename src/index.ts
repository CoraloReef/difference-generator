import * as fs from 'fs';
import * as _ from 'lodash/fp';
import * as path from 'path';

import render from './formatters';
import parsers from './parsers';
import { LineStatus } from './types';

const getObjectFrom = (pathFile: string): Record<string, unknown> => {
    const fileContent = fs.readFileSync(pathFile, 'utf-8');
    return parsers(path.extname(pathFile), fileContent);
};

const getAst = (objFirst: Record<string, unknown>, objSecond: Record<string, unknown>): LineStatus[] => {
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
                    children: getAst(valueFirst as Record<string, unknown>, valueSecond as Record<string, unknown>),
                    value: undefined, // Make the 'value' field explicit
                };
            }
            return {
                key,
                status: 'changed',
                valueOld: valueFirst,
                valueNew: valueSecond,
                value: undefined, // Make the 'value' field explicit
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

export default (firstPathFile: string, secondPathFile: string, outputFormat = 'cascade'): string => {
    const objFirst = getObjectFrom(firstPathFile);
    const objSecond = getObjectFrom(secondPathFile);
    const ast = getAst(objFirst, objSecond);
    return render(ast, outputFormat);
};
