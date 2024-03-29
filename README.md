# Difference Calculator

[![Maintainability](https://api.codeclimate.com/v1/badges/a3f977a8261b4408be88/maintainability)](https://codeclimate.com/github/CoraloReef/difference-generator/maintainability)

### Description
Utility to find differences in configuration files.

Utility features:

* Format support json, yaml, ini

* Generating a report in the form of plain text, standard and json
 
### Installation

```
npm install difference-calculator-coraloreef -g
```

### Usage

```
gendiff --format json before.yaml after.yaml
```

### Help

```
gendiff -h
Usage: gendiff [options] <firstConfig> <secondConfig>

Compares two configuration files and shows a difference.

Options:
  -V, --version        output the version number
  -f, --format [type]  Output formats: standard, plain, json
  -h, --help           output usage information
