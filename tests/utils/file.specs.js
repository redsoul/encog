describe('File Utils', function () {
    const Encog = require(PATHS.BASE);
    Encog.Log.options.logLevel = 'silent';

    const FileUtils = Encog.Utils.File;
    const fs = require("fs");
    const NetworkUtil = Encog.Utils.Network;
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