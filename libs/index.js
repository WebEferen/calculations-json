const xlsx = require('xlsx');
const parser = require('./parser');

module.exports.xlsToJson = (config = {input: {type: 'file', path: null, delimiter: ';'}, options: {headerLine: 0, contentStartsAt: 1}, excludedLines: []}) => {
  const rawFile = xlsx.readFile(config.input.path);
  const sheetId = rawFile.Sheets[rawFile.SheetNames[0]];
  const csvString = xlsx.utils.sheet_to_csv(sheetId, {RS: '\r\n', FS: ';'});
  return parser.parseFileFromBuffer(csvString, config);
};

module.exports.xlsxToJson = (config = {input: {type: 'file', path: null, delimiter: ';'}, options: {headerLine: 0, contentStartsAt: 1}, excludedLines: []}) => {
  const rawFile = xlsx.readFile(config.input.path);
  const sheetId = rawFile.Sheets[rawFile.SheetNames[0]];
  const csvString = xlsx.utils.sheet_to_csv(sheetId, {RS: '\r\n', FS: ';'});
  return parser.parseFileFromBuffer(csvString, config);
};

module.exports.csvToJson = (config = {input: {type: 'file', path: null, delimiter: ';'}, options: {headerLine: 0, contentStartsAt: 1}, excludedLines: []}) => {
  return parser.parseFile(config);
};