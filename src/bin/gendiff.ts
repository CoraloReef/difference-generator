#!/usr/bin/env node

import * as path from 'path'
import * as commander from 'commander'
import * as fs from 'fs'

import genDiff from '..'
import * as info from '../../package.json'

const program = new commander.Command()

program
  .version(info.version)
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action((firstConfig, secondConfig) => {
    const firstConfigPath = path.resolve(process.cwd(), firstConfig)
    const secondConfigPath = path.resolve(process.cwd(), secondConfig)

    const firstConfigData = fs.readFileSync(firstConfigPath, 'utf-8')
    const secondConfigData = fs.readFileSync(secondConfigPath, 'utf-8')

    console.log(genDiff(firstConfigData, secondConfigData, program.format))
  });

program.parse(process.argv)
