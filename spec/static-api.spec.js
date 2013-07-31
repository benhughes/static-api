
describe('static-api', function () {
    var StaticApi, fs, staticApiFunctions;
    beforeEach(function () {
        StaticApi = require('../index.js');
        fs = require('fs');
        staticApiFunctions = StaticApi.prototype;
        spyOn(fs, 'mkdirSync');
        spyOn(fs, 'writeFileSync');
    });

    it('should be a function', function () {
        expect(typeof StaticApi).toEqual('function');
    });
    describe('initial functions', function () {
        it('should call parseSettings and createJsonFolderStructure', function () {
            var exampleSettings = {'test': 'test'};
            spyOn(staticApiFunctions, 'parseSettings');
            spyOn(staticApiFunctions, 'createJsonFolderStructure');
            new StaticApi(exampleSettings);
            expect(staticApiFunctions.parseSettings).toHaveBeenCalledWith(exampleSettings);
            expect(staticApiFunctions.createJsonFolderStructure).toHaveBeenCalled();
        });

    });
    describe('parseSettings', function () {
        beforeEach(function () {
            spyOn(staticApiFunctions, 'merge');
            spyOn(staticApiFunctions, 'getJsonFromPath');
            spyOn(fs, 'existsSync');
        });
        it('should call fs.existsSync if string is passed as object', function () {
            var testSettings = {
                'test': 'test',
                object: "test"
            };
            fs.existsSync.andReturn(true);
            staticApiFunctions.parseSettings(testSettings);
            expect(fs.existsSync).toHaveBeenCalledWith("test");
        });
        it('should call staticApiFunctions.getJsonFromPath if fs.existsSync returns true', function () {
            var testSettings = {
                'test': 'test',
                object: "test"
            };
            fs.existsSync.andReturn(true);
            staticApiFunctions.parseSettings(testSettings);
            expect(fs.existsSync).toHaveBeenCalledWith("test");
            expect(staticApiFunctions.getJsonFromPath).toHaveBeenCalledWith("test");
        });
        it('should throw error if fs.existsSync returns false', function () {
            var testSettings = {
                'test': 'test',
                object: "test"
            };
            fs.existsSync.andReturn(false);
            expect(function () {staticApiFunctions.parseSettings(testSettings); }).toThrow();
        });
        it('should throw error if no object is passed with setings', function () {
            var testSettings = {
                'test': 'test'
            };
            expect(function () {staticApiFunctions.parseSettings(testSettings); }).toThrow();

        });
        it('should throw error if a non object is passed', function () {
            expect(function () {staticApiFunctions.parseSettings(); }).toThrow();
            expect(function () {staticApiFunctions.parseSettings('blah'); }).toThrow();
            expect(function () {staticApiFunctions.parseSettings(3424); }).toThrow();
        });
        it('should call this.merge with defaultOptions and passed settings', function () {
            var testSettings = {
                'test': 'test',
                object: {}
            };
            staticApiFunctions.parseSettings(testSettings);
            expect(staticApiFunctions.merge).toHaveBeenCalledWith(staticApiFunctions.defaultOptions, testSettings);
        });
    });
    describe('createJsonFolderStructure', function () {
        beforeEach(function () {
            spyOn(staticApiFunctions, 'deleteFolderRecursive');
            spyOn(staticApiFunctions, 'writeJsonFile');
            spyOn(staticApiFunctions, 'processDataRecursive');
            spyOn(fs, 'existsSync');
            spyOn(fs, 'renameSync');
        });

        it('should call the correct functions', function () {
            staticApiFunctions.settings = {
                'outputFolder': 'test',
                'object': {}
            };

            staticApiFunctions.createJsonFolderStructure();
            expect(fs.existsSync).toHaveBeenCalledWith(staticApiFunctions.settings.outputFolder);
            expect(fs.mkdirSync).toHaveBeenCalled();
            expect(staticApiFunctions.writeJsonFile).toHaveBeenCalled();
            expect(staticApiFunctions.processDataRecursive).toHaveBeenCalled();
        });
        it('should call deleteFolderRecursive with outputFolder if it exists and backup is set to false', function () {
            staticApiFunctions.settings = {
                'outputFolder': 'test',
                'object': {},
                'backUp': false
            };
            fs.existsSync.andReturn(true);

            staticApiFunctions.createJsonFolderStructure();
            expect(staticApiFunctions.deleteFolderRecursive).toHaveBeenCalled();

        });
        it('should renameSync folder if to name + _bk if it exists and backup is set to true', function () {
            staticApiFunctions.settings = {
                'outputFolder': 'test',
                'object': {},
                'backUp': true
            };
            var i = 0;
            fs.existsSync.andCallFake(function () {
                i++;
                return (i === 1) ? true : false;
            });

            staticApiFunctions.createJsonFolderStructure();
            expect(staticApiFunctions.deleteFolderRecursive).not.toHaveBeenCalled();
            expect(fs.renameSync).toHaveBeenCalled();

        });
        it('should delete the previous backup folder if it exists and backup is set to true', function () {
            staticApiFunctions.settings = {
                'outputFolder': 'test',
                'object': {},
                'backUp': true
            };
            fs.existsSync.andReturn(true);

            staticApiFunctions.createJsonFolderStructure();
            expect(staticApiFunctions.deleteFolderRecursive).toHaveBeenCalled();
            expect(fs.renameSync).toHaveBeenCalled();

        });
    });
    describe('processDataRecursive', function () {
        beforeEach(function () {
            spyOn(staticApiFunctions, 'writeJsonFile');
            spyOn(staticApiFunctions, 'processDataRecursive').andCallThrough();


        });
        afterEach(function () {
            staticApiFunctions.currentDirectory = undefined;
        });
        it('should recursively call it self if object contains child objects and create the correct folder structure', function () {
            var fakeObject = {
                'object': {
                    'attribute1': 1,
                    'attribute2': 2,
                    'attribute3': 3
                },
                attribute: 1,
                object2: {
                    'attribute4': 4
                }
            };

            staticApiFunctions.currentDirectory = 'test123';

            staticApiFunctions.processDataRecursive(fakeObject);
            expect(staticApiFunctions.processDataRecursive.callCount).toEqual(3);
            expect(staticApiFunctions.processDataRecursive.argsForCall[0][0]).toEqual(fakeObject);
            expect(staticApiFunctions.processDataRecursive.argsForCall[1][0]).toEqual(fakeObject.object);
            expect(staticApiFunctions.processDataRecursive.argsForCall[2][0]).toEqual(fakeObject.object2);

            expect(staticApiFunctions.writeJsonFile.callCount).toEqual(2);
            expect(staticApiFunctions.writeJsonFile.argsForCall[0]).toEqual(['test123/object/object.json', fakeObject.object]);
            expect(staticApiFunctions.writeJsonFile.argsForCall[1]).toEqual(['test123/object2/object2.json', fakeObject.object2]);

            expect(fs.mkdirSync.callCount).toEqual(2);
            expect(fs.mkdirSync.argsForCall[0]).toEqual(['test123/object']);
            expect(fs.mkdirSync.argsForCall[1]).toEqual(['test123/object2']);

            expect(staticApiFunctions.currentDirectory).toEqual('./');

        });
        it('should never call writeJsonFile and processDataRecursive again if no objects are in the object', function () {
            var fakeObject = {
                    'attribute1': 1,
                    'attribute2': 2,
                    'attribute3': 3
                };
            staticApiFunctions.processDataRecursive(fakeObject);
            expect(staticApiFunctions.processDataRecursive.callCount).toEqual(1);
            expect(staticApiFunctions.writeJsonFile).not.toHaveBeenCalled();

        });

    });
    describe('writeJsonFile', function () {
        it('should call fs.writeFileSync with the passed filename and a stringified object', function () {
            var fakeObject = {
                'attribute1': 1,
                'attribute2': 2,
                'attribute3': 3
            };
            staticApiFunctions.writeJsonFile('test/test/test.json', fakeObject);
            expect(fs.writeFileSync).toHaveBeenCalledWith('test/test/test.json', JSON.stringify(fakeObject));
        });
    });
});