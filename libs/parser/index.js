const fs = require('fs');
const path = require('path');
const csv = require('csv-parse');

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

exports = module.exports.parseFileFromString = (inputStream, {options = {headerLine: 0, contentStartsAt: 1}, excludedLines = []}) => {
  const parser = csv({delimiter: ';'});
  return parseNormalised(parser, Buffer.from(inputStream, 'utf8'), excludedLines, options.headerLine, options.contentStartsAt);
}

/**
 * Parser for any type of the file (stream / file)
 * @param {Object} config Config for the parser
 */
function parseFile({input, excludedLines = [], options = { headerLine: 0, contentStartsAt: 1}}) {
  const parser = csv({delimiter: input.delimiter ? input.delimiter : ';'});

  if (input.type === 'file') {
    const buffer = fs.readFileSync(path.normalize(input.path));
    return parseNormalised(parser, buffer, excludedLines, options.headerLine, options.contentStartsAt);
  }
  
  const buffer = [];
  const buffsArray = [];
  const stream = fs.createReadStream(input.path);
  stream.on('data', (data) => buffsArray.push(data));

  return new Promise((resolve, reject) => {
    stream.on('end', () => {
      buffer.push(Buffer.concat(buffsArray));
      const headerLine = options.headerLine;
      const contentStartsAt = options.contentStartsAt;
      parseNormalised(parser, buffer[0], excludedLines, headerLine, contentStartsAt)
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
 * @param {Number} headerLine Header line number
 * @param {Number} contentStartsAt Content starts at given number
 */
function parseNormalised(parser, buffer, excludedLines = [], headerLine = 0, contentStartsAt = 1) {
  let data = [];
  let iterator = 0;

  parser.write(buffer);
  parser.on('readable', () => {
    while (row = parser.read()) { 
      if (!isExcluded(excludedLines, iterator)) {
        const included = include(row, headerLine, contentStartsAt, iterator);
        if (included) data.push(included);
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
 * @param {Number} headerLine Line from header is presented
 * @param {Number} contentStartsAt Line from the content is being parsed
 * @param {Number} iterator Iterator (defaults 0)
 */
function include(row, headerLine = 0, contentStartsAt = 1, iterator = 0) {
  if (iterator === headerLine) return row;
  if (iterator >= contentStartsAt) return row;
  return;
}