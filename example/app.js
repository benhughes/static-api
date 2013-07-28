var baseData = require('./example.json'),
    path = require('path'),
    staticApi = require('../index.js');


var dataFolder = path.join(__dirname, 'data/');

new staticApi({
    outputFolder: dataFolder,
    object: baseData
});