const xlsx = require('xlsx');
const parser = require('./parser');
const _config = require('./types/config');

module.exports.xlsToJson = (config = _config) => {
  const rawFile = xlsx.readFile(config.input.path);
  const sheetName = config.options.xlsSheetName;
  const sheet = (sheetName) ? sheetName : rawFile.SheetNames[0];
  const csvString = xlsx.utils.sheet_to_csv(rawFile.Sheets[sheet], {RS: '\r\n', FS: ';'});
  return parser.parseFileFromBuffer(csvString, config);
};

module.exports.xlsxToJson = (config = _config) => {
  const rawFile = xlsx.readFile(config.input.path);
  const sheetName = config.options.xlsSheetName;
  const sheet = (sheetName) ? sheetName : rawFile.SheetNames[0];
  const csvString = xlsx.utils.sheet_to_csv(rawFile.Sheets[sheet], {RS: '\r\n', FS: ';'});
  return parser.parseFileFromBuffer(csvString, config);
};

module.exports.csvToJson = (config = _config) => {
  return parser.parseFile(config);
};