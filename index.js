/**
 * Example config:
 * 
 * {
 *  input: {
 *    type: 'file | stream',                  // type - file or stream
 *    path: 'filePath | streamPath',          // path for the file
 *    delimiter: ';' (default)                // delimiter (works only in CSV)
 *  },
 *  options: {
 *    headerAsKey: false                      // if want to get selected header as key
 *    headerLine: 0,                          // line number
 *    contentStartsAt: 1                      // line number
 *  },
 *  excludedLines: [0,1,2]                    // line indexes (lines to exclude)
 * }
 */

const libs = require('./libs');
exports = module.exports = libs;

libs.xlsToJson({

  input: {
    type: 'file',
    path: __dirname + '/test.xls',
  },
  options: {
    headerAsKey: true,
    headerLine: 4,
    contentStartsAt: 6
  },
  excludedLines: [0,1,2,3]

}).then((res) => console.log(res.reverse()));