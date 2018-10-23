const libs = require('./libs');
exports = module.exports = libs;

// Test

// libs.csvToJson(
//   {
//     input: {
//       type: 'file',
//       path: __dirname + '/test.csv',
//       delimiter: ';'
//     },
//     options: {
//       headerLine: 0,
//       contentStartsAt: 1
//     },
//     excludedLines: [0,1]
//   }
// ).then((res) => console.log(res));

libs.xlsToJson(
  {
    input: {
      type: 'file',
      path: __dirname + '/test.xls'
    }
  }
).then((res) => console.log(res));