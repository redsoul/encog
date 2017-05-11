describe('ResilientPropagation', function () {
    const ResilientPropagation = require(PATHS.PROPAGATION + 'resilient');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const DataToolbox = require(PATHS.UTILS + 'dataToolbox');

    beforeEach(function () {

    });

    it('XOR Dataset', function () {
        // train the neural network
        const dataset = NetworkUtil.getXORDataset();
        const network = NetworkUtil.createXORNetwork();
        const train = new ResilientPropagation(network, dataset.input, dataset.output);

        NetworkUtil.trainNetwork(train);
        const accuracy = NetworkUtil.validateNetwork(network, dataset.input, dataset.output);

        expect(accuracy >= 90).toBe(true);
    });

    it('Iris Flower Dataset', function () {
        // train the neural network
        const irisDataset = NetworkUtil.getIrisDataset();
        const network = NetworkUtil.createIrisNetwork();

        let inputDataset = DataToolbox.trainTestSpit(irisDataset.input);
        let outputDataset = DataToolbox.trainTestSpit(irisDataset.output);

        const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);

        NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

        expect(accuracy >= 90).toBe(true);
    });

    it('Iris Flower Dataset using normalized data', function () {
        // train the neural network
        const irisDataset = NetworkUtil.getIrisDataset();
        const network = NetworkUtil.createIrisNetwork();

        let inputDataset = DataToolbox.trainTestSpit(irisDataset.input);
        let outputDataset = DataToolbox.trainTestSpit(irisDataset.output);

        DataToolbox.normalizeData(inputDataset.train);
        DataToolbox.normalizeData(inputDataset.test);

        const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);

        NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

        expect(accuracy >= 90).toBe(true);
    });
});