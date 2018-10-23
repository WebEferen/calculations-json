const xlsx = require('xlsx');
const parser = require('./parser');

module.exports.xlsToJson = (config) => {
  const rawFile = xlsx.readFile(config.input.path);
  const sheetId = rawFile.Sheets[rawFile.SheetNames[0]];
  const csvString = xlsx.utils.sheet_to_csv(sheetId, {RS: '\r\n', FS: ';'});
  return parser.parseFileFromString(csvString, config);
};

module.exports.xlsxToJson = (config) => {
  const rawFile = xlsx.readFile(config.input.path);
  const sheetId = rawFile.Sheets[rawFile.SheetNames[0]];
  const csvString = xlsx.utils.sheet_to_csv(sheetId, {RS: '\r\n', FS: ';'});
  return parser.parseFileFromString(csvString, config);
};

module.exports.csvToJson = (config) => {
  return parser.parseFile(config);
};