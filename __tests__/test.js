import fs from 'fs';
import genDiff from '../src';

const filesPath = '__tests__/__fixtures__/';

describe('test liner difference', () => {
  const result = fs.readFileSync(`${filesPath}result.txt`, 'utf-8');

  const beforeJson = `${filesPath}before.json`;
  const afterJson = `${filesPath}after.json`;
  const beforeYaml = `${filesPath}before.yml`;
  const afterYaml = `${filesPath}after.yml`;
  const beforeIni = `${filesPath}before.ini`;
  const afterIni = `${filesPath}after.ini`;

  test.each([
    [beforeJson, afterJson],
    [beforeYaml, afterYaml],
    [beforeIni, afterIni],
  ])('liner difference (%s, %s)', (before, after) => {
    expect(genDiff(before, after)).toBe(result);
  });
});

describe('test tree difference', () => {
  const resultTree = fs.readFileSync(`${filesPath}resultTree.txt`, 'utf-8');

  const beforeTreeJson = `${filesPath}beforeTree.json`;
  const afterTreeJson = `${filesPath}afterTree.json`;
  const beforeTreeYaml = `${filesPath}beforeTree.yml`;
  const afterTreeYaml = `${filesPath}afterTree.yml`;
  const beforeTreeIni = `${filesPath}beforeTree.ini`;
  const afterTreeIni = `${filesPath}afterTree.ini`;

  test.each([
    [beforeTreeJson, afterTreeJson],
    [beforeTreeYaml, afterTreeYaml],
    [beforeTreeIni, afterTreeIni],
  ])('liner difference (%s, %s)', (before, after) => {
    expect(genDiff(before, after)).toBe(resultTree);
  });
});
