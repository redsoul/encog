describe('File Utils', function () {
    const FileUtils = require(PATHS.UTILS + 'file');
    const fs = require("fs");
    const NetworkUtil = require(PATHS.UTILS + 'network');
    let network;

    describe('saveNetwork method', function () {
        beforeEach(function () {
            network = NetworkUtil.createXORNetwork();
        });

        test('', function () {
            const toJSONSpy = jest.spyOn(network, 'toJSON');
            fs.writeFileSync = jest.fn();
            FileUtils.saveNetwork(network, 'test.dat');
            expect(fs.writeFileSync).toHaveBeenCalled();
            expect(toJSONSpy).toHaveBeenCalled();
        });
    });
});