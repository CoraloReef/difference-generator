import cascadeFormatter from './cascade';
import plainFormatter from './plain';
import jsonFormatter from './json';

const formatter = {
  cascade: cascadeFormatter,
  plain: plainFormatter,
  json: jsonFormatter,
};

export default (ast, format) => formatter[format](ast);
