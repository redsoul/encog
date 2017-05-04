describe('BackPropagation', function () {
    const BackPropagation = require(PATHS.PROPAGATION + 'back');
    const NetworkUtil = require(PATHS.TEST_HELPERS + 'networkUtil');
    let network;

    beforeEach(function () {

    });

    it('XOR Dataset', function () {
        // train the neural network
        const dataset = NetworkUtil.getXORDataset();
        network = NetworkUtil.createXORNetwork();
        const train = new BackPropagation(network, dataset.input, dataset.output);

        NetworkUtil.trainNetwork(train, {maxIterations: 250});

        const accuracy = NetworkUtil.validateNetwork(network, dataset.input, dataset.output);

        expect(accuracy >= 90).toBe(true);
    });
});