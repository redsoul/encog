describe('File Utils', function () {
    var rewire = require("rewire");
    const FileUtils = rewire(PATHS.UTILS + 'file');
    const fsMock = jasmine.createSpyObj('fs', ['writeFileSync', 'readFileSync']);
    const NetworkUtil = require(PATHS.UTILS + 'network');
    let network;

    FileUtils.__set__("fs", fsMock);

    describe('saveNetwork method', function () {
        beforeEach(function () {
            network = NetworkUtil.createXORNetwork();
        });

        it('', function () {
            spyOn(network, 'toJSON');
            FileUtils.saveNetwork(network, 'test.dat');
            expect(fsMock.writeFileSync).toHaveBeenCalled();
            expect(network.toJSON).toHaveBeenCalled();
        });
    });

    describe('loadNetwork method', function () {
        beforeEach(function () {
            network = NetworkUtil.createXORNetwork();
        });

        it('BasicNetwork', function () {
            fsMock.readFileSync.and.returnValue(JSON.stringify(network));
            FileUtils.__set__("fs", fsMock);
            const newNetwork = FileUtils.loadNetwork('test.dat');
            expect(newNetwork.constructor.name).toBe("BasicNetwork");
        });
    });
});