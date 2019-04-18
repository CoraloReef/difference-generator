import yaml from 'js-yaml';
import ini from 'ini';

const typesMethod = {
  '.json': JSON.parse,
  '.ini': ini.parse,
  '.yml': yaml.safeLoad,
};

const parsers = (type, data) => typesMethod[type](data);

export default parsers;
