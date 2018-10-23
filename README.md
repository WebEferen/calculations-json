# CALCULATIONS JSON

## Introduction

Calculations JSON is made to simplify parse process for the following files:

* XLS
* XLSX
* CSV

> That extensions works perfectly and on that extensions it has been tested out.

## Installation

To install that module just type:

```javascript
npm install calculations-json
```

After that just import that module:

```javascript
const calculations = require('calculations-json');
```

## Getting started

To start using that module You will have to specify which file do You want to parse and convert into the JSON format.

There are 3 possibilities for now:

```javascript
calculations.xlsToJson(config);
```

```javascript
calculations.xlsxToJson(config);
```

```javascript
calculations.csvToJson(config);
```

Configuration for that will be as following:

```javascript
const config = {
  input: {
    type: 'file | stream',  // stream or file (default 'file')
    path: 'path to file',   // relative path to the file
    delimiter: ';'          // delimiter (default ';')
  },
  options: {
    headerLine: 0,          // header line number
    contentStartsAt: 1      // line from where the content starts
  },
  excludedLines: [0,1]      // lines to exclude
};
```

## Credits

&copy; by Mike Makowski (**2018**)  

Portfolio: [MMakowski.Online](https://mmakowski.online)    
LinkedIn: [WebEferen](https://www.linkedin.com/in/mmakowski97/)