import { LineStatus } from '../types'
import cascadeFormatter from './cascade'
import plainFormatter from './plain'

const formatter: Record<string, (ast: Array<LineStatus>) => string> = {
  cascade: cascadeFormatter,
  plain: plainFormatter,
  json: JSON.stringify,
};

export default (ast: Array<LineStatus>, format: string): string => formatter[format](ast)
