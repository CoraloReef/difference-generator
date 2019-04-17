import yaml from 'js-yaml';
import ini from 'ini';

const parsers = (type, data) => {
  if (type === '.json') {
    return JSON.parse(data);
  }
  if (type === '.ini') {
    return ini.parse(data);
  }
  return yaml.safeLoad(data);
};

export default parsers;
