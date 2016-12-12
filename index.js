var fs = require('fs'),
    path = require('path');

var staticAPI = function (settings) {
    this.parseSettings(settings);
    this.createJsonFolderStructure();

};

staticAPI.prototype = {
    defaultOptions: {
        outputFolder: 'data',
        backUp: true,
        pagination: true,
        outputExtension: 'json'
    },
    parseSettings: function (settings) {
        if (typeof settings !== 'object') {
            throw ('A settings object is needed');
        } else if (settings.object === undefined) {
            throw ('an json is needed for static-api to work');
        } else if (typeof settings.object === 'string') {
            if (fs.existsSync(settings.object)) {
                settings.object = this.getJsonFromPath(settings.object);
            } else {
                throw ('json object not found at supplied path');
            }
        }
        this.settings = this.merge(this.defaultOptions, settings);
        this.settings.outputExtension = (this.settings.outputExtension !== '') ?
          '.' + this.settings.outputExtension.replace(/^\./, '') // Remove leading dot from extension
          : this.settings.outputExtension;
    },
    getJsonFromPath: function (path) {
        return require(path);
    },
    createJsonFolderStructure: function () {
        if (fs.existsSync(this.settings.outputFolder)) {
            if (this.settings.backUp) {
                if (fs.existsSync(this.settings.outputFolder + "_bk")) {
                    this.deleteFolderRecursive(this.settings.outputFolder + "_bk");
                }
                fs.renameSync(this.settings.outputFolder, this.settings.outputFolder + "_bk");

            } else {
                this.deleteFolderRecursive(this.settings.outputFolder);
            }
        }
        fs.mkdirSync(this.settings.outputFolder);
        this.currentDirectory = this.settings.outputFolder;
        this.writeJsonFile(path.join(this.currentDirectory, path.basename(this.currentDirectory, '/') + this.settings.outputExtension), this.settings.object);
        this.processDataRecursive(this.settings.object);

    },
    processDataRecursive: function (jsonObject) {
        var outputExtension = this.settings.outputExtension;
        for (var id in jsonObject) {
            if (jsonObject.hasOwnProperty(id)) {
                if (typeof jsonObject[id] === 'object') {
                    this.currentDirectory = path.join(this.currentDirectory, id);
                    fs.mkdirSync(this.currentDirectory);
                    this.writeJsonFile(path.join(this.currentDirectory, id + outputExtension), jsonObject[id]);
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
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                    this.deleteFolderRecursive(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            }, this);
            fs.rmdirSync(path);
        }
    },
    merge: function (obj1, obj2) {
        for (var attribute in obj2) {
            if (obj2.hasOwnProperty(attribute)) {
                obj1[attribute] = obj2[attribute];
            }
        }
        return obj1;
    }



};

module.exports = staticAPI;
