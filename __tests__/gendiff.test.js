import fs from 'fs';
import genDiff from '../src/bin/gendiff';

const filesPath = '__tests__/__fixtures__/';

test('test JSON liner difference', () => {
  const file1 = `${filesPath}before.json`;
  const file2 = `${filesPath}after.json`;
  const result = fs.readFileSync(`${filesPath}result.txt`, 'utf-8');

  expect(genDiff(file1, file2)).toBe(result);
});

test('test Yaml liner difference', () => {
  const file1 = `${filesPath}before.yml`;
  const file2 = `${filesPath}after.yml`;
  const result = fs.readFileSync(`${filesPath}result.txt`, 'utf-8');

  expect(genDiff(file1, file2)).toBe(result);
});
