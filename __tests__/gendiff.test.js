import fs from 'fs';
import genDiff from '../src/bin/gendiff';

const filesPath = '__tests__/__fixtures__/';

test('test liner difference', () => {
  const file1 = `${filesPath}before.json`;
  const file2 = `${filesPath}after.json`;
  const result = fs.readFileSync(`${filesPath}result.txt`, 'utf-8');

  expect(genDiff(file1, file2)).toBe(result);
});
