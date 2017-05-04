describe('ManhattanPropagation', function () {
    const ManhattanPropagation = require(PATHS.PROPAGATION + 'manhattan');
    const NetworkUtil = require(PATHS.TEST_HELPERS + 'networkUtil');

    beforeEach(function () {

    });

    it('XOR Dataset', function () {
        // train the neural network
        const dataset = NetworkUtil.getXORDataset();
        const network = NetworkUtil.createXORNetwork();
        const train = new ManhattanPropagation(network, dataset.input, dataset.output);

        NetworkUtil.trainNetwork(train, {maxIterations: 1000});
        const accuracy = NetworkUtil.validateNetwork(network, dataset.input, dataset.output);

        expect(accuracy >= 75).toBe(true);
    });
});