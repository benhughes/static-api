var fs = require('fs'),
    path = require('path');

var staticAPI = function (settings) {
    this.parseSettings(settings);
    this.createJsonFolderStructure();

};

staticAPI.prototype = {
    defaultOptions: {
        outputFolder: 'data',
        useBackUps: true,
        pagination: true
    },
    parseSettings: function (settings) {
        if (typeof settings !== 'object') {
            throw('A settings object is needed')
        }
        this.settings = this.merge(this.defaultOptions, settings);



    },
    createJsonFolderStructure: function () {
        this.deleteFolderRecursive(this.settings.outputFolder);
        fs.mkdirSync(this.settings.outputFolder);
        this.currentDirectory = this.settings.outputFolder;
        this.processDataRecursive(this.settings.object);
    },
    processDataRecursive: function (jsonObject) {
        for (var id in jsonObject) {
            //console.log('checking ' + id)
            if( jsonObject.hasOwnProperty( id ) ) {
                //console.log(id + ' is a ' + typeof jsonObject[id]);
                if(typeof jsonObject[id] === 'object') {
                    this.currentDirectory = path.join(this.currentDirectory, id);
                    fs.mkdirSync(this.currentDirectory);
                    this.writeJsonFile(path.join(this.currentDirectory, id + '.json'), jsonObject[id]);

                    console.log(id + ' is an object creating directory');

                    this.processDataRecursive(jsonObject[id]);
                }
            }

        }
        this.currentDirectory = path.join(this.currentDirectory, '../');

    },
    writeJsonFile: function (filePath, object) {
        fs.writeFileSync(filePath, JSON.stringify(object));
    },
    deleteFolderRecursive: function (path) {
        var files = [];
        var _this = this;
        if( fs.existsSync(path) ) {
            files = fs.readdirSync(path);
            files.forEach(function(file,index){
                var curPath = path + "/" + file;
                if(fs.statSync(curPath).isDirectory()) { // recurse
                    _this.deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    },
    merge: function (obj1, obj2) {
        for (var attrname in obj2) {
            obj1[attrname] = obj2[attrname];
        }
        return obj1;
    }



};

module.exports = staticAPI;