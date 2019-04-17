import yaml from 'js-yaml';

const parsers = (type, data) => {
  if (type === '.json') {
    return JSON.parse(data);
  }
  return yaml.safeLoad(data);
};

export default parsers;
