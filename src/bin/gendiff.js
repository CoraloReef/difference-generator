#!/usr/bin/env node

import commander from 'commander'

import genDiff from '../../src'
import info from '../../package.json'

const program = commander

program
    .version(info.version)
    .arguments('<firstConfig> <secondConfig>')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format')
    .action((firstConfig, secondConfig) => {
        console.log(genDiff(firstConfig, secondConfig, program.format))
    })
    .parse(process.argv)
