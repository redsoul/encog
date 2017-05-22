describe('File Utils', function () {
    const FileUtils = require(PATHS.UTILS + 'file');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    let network;

    beforeEach(function () {
        network = NetworkUtil.createXORNetwork();
    });

    describe('saveNetwork method', function () {
        it('', function () {
            FileUtils.saveNetwork(network)
        });
    });

});
