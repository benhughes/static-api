#!/usr/local/bin/node

var program = require('commander'),
    npmPackage = require('./package.json'),
    path = require('path'),
    staticApi = require('./index.js');


program
    .version(npmPackage.version)
    .option('-j, --json [path]', 'path of .json file')
    .option('-f, --folder [path]', 'Folder where the API structure will be outputted [data]', 'data')
    .option('-b, --backup [true]', 'If the folder exists shall we back it up (will save it as [folder]_bk', 'true')
    .parse(process.argv);

if (!program.json || program.json === true) {
    throw ('path to object needed');
}

var settings = {
    outputFolder: path.resolve('.', program.folder),
    object: path.resolve('.', program.json),
    backUp: program.backup !== 'false'
};


new staticApi(settings);

