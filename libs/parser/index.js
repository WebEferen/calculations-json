const fs = require('fs');
const path = require('path');
const csv = require('csv-parse');

/**
 * Parser for any type of the file (stream / file)
 * @param {Object} config Config for the parser
 */
function parseFile(config = {input, excludedLines: [], options: { headerLine: 0, contentStartsAt: 1, headerAsKey: false }}) {
  const parser = csv({delimiter: config.input.delimiter ? config.input.delimiter : ';'});

  if (input.type === 'file') {
    const buffer = fs.readFileSync(path.normalize(config.input.path));
    return parseNormalised(parser, buffer, excludedLines, config.options);
  }
  
  const buffer = [];
  const buffsArray = [];
  const stream = fs.createReadStream(config.input.path);
  stream.on('data', (data) => buffsArray.push(data));

  return new Promise((resolve, reject) => {
    stream.on('end', () => {
      buffer.push(Buffer.concat(buffsArray));
      parseNormalised(parser, buffer[0], excludedLines, config.options)
        .then((result) => resolve(result));
    });
    stream.on('error', () => reject('Error during process the file!'));
  });
}

/**
 * Parser and normaliser for the whole file
 * @param {Parser} parser Parser library
 * @param {Buffer} buffer Current data buffer
 * @param {Number[]} excludedLines Excluded lines array
 * @param {Object} options Options object
 */
function parseNormalised(parser, buffer, excludedLines = [], options = {headerLine: 0, contentStartsAt: 1, headerAsKey: false}) {
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

function mapPerKey(row = {data: []}, headers = []) {
  let index = 0;
  const mapped = [];
  if (row.data[0]) headers.forEach(header => mapped[prepareKey(header)] = row.data[index++]);
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
 * @param {Number[]} excludedLines Excluded lines array
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
 * @param {Object} options Options object
 */
function include(row, iterator = 0, options = {headerLine: 0, contentStartsAt: 1, headerAsKey: false}) {
  if (iterator === options.headerLine) return {header: true, data: row};
  if (iterator >= options.contentStartsAt) return {data: row};
  return;
}

/**
 * Parser for the csv
 */
exports = module.exports.parseFile = (
  {
    input = {type: 'file', path: null, delimiter: ';'},
    options = {headerLine: 0, contentStartsAt: 1},
    excludedLines = []
  }) => {
  
  if (path) return parseFile({input, options, excludedLines});
  
  console.error('Provide input.path object!');
  process.exit(1);
};

exports = module.exports.parseFileFromBuffer = (inputStream, {options = {headerLine: 0, contentStartsAt: 1, headerAsKey: false}, excludedLines = []}) => {
  const parser = csv({delimiter: ';'});
  return parseNormalised(parser, Buffer.from(inputStream, 'utf8'), excludedLines, options);
}