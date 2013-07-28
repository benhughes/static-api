
describe('static-api', function () {
    var staticApi, fs, staticApiFunctions;
    beforeEach(function () {
        staticApi = require('../index.js');
        fs = require('fs');
        staticApiFunctions = staticApi.prototype;
        spyOn(fs, 'mkdirSync');
    });

    it('should be a function', function () {
        expect(typeof staticApi).toEqual('function');
    });
    describe('initial functions', function () {
        it('should call parseSettings and createJsonFolderStructure', function () {
            var exampleSettings = {'test':'test'};
            spyOn(staticApiFunctions, 'parseSettings');
            spyOn(staticApiFunctions, 'createJsonFolderStructure');
            new staticApi(exampleSettings);
            expect(staticApiFunctions.parseSettings).toHaveBeenCalledWith(exampleSettings);
            expect(staticApiFunctions.createJsonFolderStructure).toHaveBeenCalled();
        });

    });
    describe('parseSettings', function () {
        beforeEach(function () {
           spyOn(staticApiFunctions, 'merge');
        });

        it('should throw error if a non object is passed', function () {
            expect(function () {staticApiFunctions.parseSettings('string');}).toThrow();
            expect(function () {staticApiFunctions.parseSettings();}).toThrow();
            expect(function () {staticApiFunctions.parseSettings(3424);}).toThrow();
        });
        it('should call this.merge with defaultOptions and passed settings', function () {
            var testSettings = {
                'test': 'test'
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
        });
        it('should call the correct functions', function () {
            expect(typeof staticApiFunctions.defaultOptions.outputFolder).toEqual('string');
            staticApiFunctions.settings = {
                'outputFolder': 'test',
                'object': {}
            }

            staticApiFunctions.createJsonFolderStructure();
            expect(fs.mkdirSync).toHaveBeenCalled();
            expect(staticApiFunctions.deleteFolderRecursive).toHaveBeenCalled();
            expect(staticApiFunctions.writeJsonFile).toHaveBeenCalled();
            expect(staticApiFunctions.processDataRecursive).toHaveBeenCalled();
        });
    });
});