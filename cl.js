#!/usr/bin/env node

var program = require('commander'),
    npmPackage = require('./package.json'),
    path = require('path'),
    staticApi = require('./index.js');


program
    .version(npmPackage.version)
    .option('-j, --json [path]', 'path of .json file')
    .option('-f, --folder [path]', 'Folder where the API structure will be outputted [data]', 'data')
    .option('-b, --backup [true]', 'If the folder exists shall we back it up (will save it as [folder]_bk', 'true')
    .option('-e, --extension [json]', 'Extension of generated files [json]', 'json')
    .option('-n, --filename [auto]', 'Name of index file in `key` directory', '')
    .parse(process.argv);

if (!program.json || program.json === true) {
    throw ('path to object needed');
}

var settings = {
    outputFolder: path.resolve('.', program.folder),
    object: path.resolve('.', program.json),
    backUp: program.backup !== 'false',
    outputExtension: program.extension,
    outputFilename: program.filename
};


new staticApi(settings);

