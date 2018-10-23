const fs = require('fs');
const path = require('path');
const csv = require('csv-parse');

const _config = require('../types/config');
const _options = _config.options;
const _input = _config.input;
const _excludedLines = _config.excludedLines;

/**
 * Parser for any type of the file (stream / file)
 * @param {_config} config Config for the parser
 */
function parseFile(config = _config) {
  const parser = csv({delimiter: config.input.delimiter ? config.input.delimiter : ';'});

  if (config.input.type === 'file') {
    const buffer = fs.readFileSync(path.normalize(config.input.path));
    return parseNormalised(parser, buffer, config.excludedLines, config.options);
  }
  
  const buffer = [];
  const buffsArray = [];
  const stream = fs.createReadStream(config.input.path);
  stream.on('data', (data) => buffsArray.push(data));

  return new Promise((resolve, reject) => {
    stream.on('end', () => {
      buffer.push(Buffer.concat(buffsArray));
      parseNormalised(parser, buffer[0], config.excludedLines, config.options)
        .then((result) => resolve(result));
    });
    stream.on('error', () => reject('Error during process the file!'));
  });
}

/**
 * Parser and normaliser for the whole file
 * @param {Parser} parser Parser library
 * @param {Buffer} buffer Current data buffer
 * @param {_excludedLines} excludedLines Excluded lines array
 * @param {_options} options Options object
 */
function parseNormalised(parser, buffer, excludedLines = _config.excludedLines, options = _config.options) {
  let data = [];
  let headers = [];
  let iterator = 0;

  parser.write(buffer);
  parser.on('readable', () => {
    while (row = parser.read()) { 
      if (!isExcluded(excludedLines, iterator)) {
        const included = include(row, iterator, options);
        if (included) {
          if (options.headerAsKey && included.header) headers = included.data;
          if (options.headerAsKey) data.push(mapPerKey(included, headers));
          else data.push(included.data);
        }
      }
      iterator++;
    };
  });

  parser.end();

  return new Promise((resolve, reject) => {
    parser.on('end', () => resolve(data));
    parser.on('error', () => reject('Error during process the file!'));
  });
}

/**
 * Mapping helper
 * @param {String[]} row Data array
 * @param {String[]} headers Headers array 
 */
function mapPerKey({data}, headers = []) {
  let index = 0;
  const mapped = [];
  if (data[0]) headers.forEach(header => mapped[prepareKey(header)] = data[index++]);
  return mapped;
}

/**
 * Prepares key for iteration
 * @param {String} key Current array key
 */
function prepareKey(key) {
  const keysArray = (key + '').toLowerCase().replace('%', '').replace('.', '').split(' ');
  const keys = keysArray.filter((key) => key.length > 0);
  return keys.join('_');
}

/**
 * Checks if the current line is excluded or not
 * @param {_excludedLines} excludedLines Excluded lines array
 * @param {Number} iterator Iterator (defaults 0) 
 */
function isExcluded(excludedLines = [], iterator = 0) {
  if (excludedLines.indexOf(iterator) === -1) return false;
  return true;
}

/**
 * Includer (injecting some dependencies)
 * @param {String[]} row Current item row
 * @param {Number} iterator Iterator (defaults 0)
 * @param {_options} options Options object
 */
function include(row, iterator = 0, options = _config.options) {
  if (iterator === options.headerLine) return {header: true, data: row};
  if (iterator >= options.contentStartsAt) return {data: row};
  return;
}

/**
 * Parser for the csv
 * @param {_config} config Config for the parser
 */
exports = module.exports.parseFile = (config = _config) => {
  
  if (path) return parseFile(config);
  
  console.error('Provide input.path object!');
  process.exit(1);
};

exports = module.exports.parseFileFromBuffer = (inputStream, {options = _config.options, excludedLines = []}) => {
  const parser = csv({delimiter: ';'});
  return parseNormalised(parser, Buffer.from(inputStream, 'utf8'), excludedLines, options);
}