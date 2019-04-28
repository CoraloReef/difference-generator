import cascadeFormatter from './cascade';
import plainFormatter from './plain';

const formatter = {
  cascade: cascadeFormatter,
  plain: plainFormatter,
};

export default (ast, format) => formatter[format](ast);
