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
 *    headerLine: 0,                          // line number
 *    contentStartsAt: 1                      // line number
 *  },
 *  excludedLines: [0,1,2]                    // line indexes (lines to exclude)
 * }
 */

const libs = require('./libs');
exports = module.exports = libs;