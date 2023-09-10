import * as fs from 'fs';
import genDiff from '../src';
import { expect } from '@jest/globals';

const filesPath = '__tests__/__fixtures__/';

describe('Test liner difference in cascade format', () => {
  const result = fs.readFileSync(`${filesPath}result.txt`, 'utf-8');

  const testData = [
    ['before.json', 'after.json'],
    ['before.yml', 'after.yml'],
    ['before.ini', 'after.ini'],
  ];

  for (const [before, after] of testData) {
    test(`liner difference (${before}, ${after})`, () => {
      expect(genDiff(`${filesPath}${before}`, `${filesPath}${after}`)).toBe(result);
    });
  }
});

describe('Test tree difference in cascade format', () => {
  const resultTree = fs.readFileSync(`${filesPath}resultTree.txt`, 'utf-8');

  const testData = [
    ['beforeTree.json', 'afterTree.json'],
    ['beforeTree.yml', 'afterTree.yml'],
    ['beforeTree.ini', 'afterTree.ini'],
  ];

  for (const [before, after] of testData) {
    test(`tree difference (${before}, ${after})`, () => {
      expect(genDiff(`${filesPath}${before}`, `${filesPath}${after}`)).toBe(resultTree);
    });
  }
});

describe('Test tree difference in plain format', () => {
  const resultTreePlain = fs.readFileSync(`${filesPath}resultPlain.txt`, 'utf-8');

  const testData = [
    ['beforeTree.json', 'afterTree.json'],
    ['beforeTree.yml', 'afterTree.yml'],
    ['beforeTree.ini', 'afterTree.ini'],
  ];

  for (const [before, after] of testData) {
    test(`tree difference (${before}, ${after})`, () => {
      expect(genDiff(`${filesPath}${before}`, `${filesPath}${after}`, 'plain')).toBe(resultTreePlain);
    });
  }
});

describe('Test tree difference in json format', () => {
  const resultTreeJson = fs.readFileSync(`${filesPath}resultJson.txt`, 'utf-8');

  const testData = [
    ['beforeTree.json', 'afterTree.json'],
    ['beforeTree.yml', 'afterTree.yml'],
    ['beforeTree.ini', 'afterTree.ini'],
  ];

  for (const [before, after] of testData) {
    test(`tree difference (${before}, ${after})`, () => {
      expect(genDiff(`${filesPath}${before}`, `${filesPath}${after}`, 'json')).toBe(resultTreeJson);
    });
  }
});
