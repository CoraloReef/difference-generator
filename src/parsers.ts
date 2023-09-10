import * as yaml from 'js-yaml';
import * as ini from 'ini';

type ParsedData = Record<string, unknown>;

const typesMethod: Record<string, (data: string) => ParsedData> = {
    '.json': JSON.parse,
    '.ini': (data) => ini.parse(data),
    '.yml': (data) => {
        const parsedData = yaml.load(data);
        if (typeof parsedData === 'object' && parsedData !== null) {
            return parsedData as ParsedData;
        } else {
            throw new Error('Invalid YAML data format');
        }
    },
};

const parsers = (type: string, data: string): ParsedData => {
    const parseMethod = typesMethod[type];
    if (!parseMethod) {
        throw new Error(`Unsupported file type: ${type}`);
    }
    return parseMethod(data);
};

export default parsers;
