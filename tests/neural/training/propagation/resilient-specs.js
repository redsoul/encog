describe('ResilientPropagation', function () {
    const ResilientPropagation = require(PATHS.PROPAGATION + 'resilient');
    const NetworkUtil = require(PATHS.TEST_HELPERS + 'networkUtil');
    const Dataset = require(PATHS.DATASET + 'dataset');
    let dataset;

    beforeEach(function () {
        dataset = new Dataset();
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

        let inputDataset = dataset.trainTestSpit(irisDataset.input);
        let outputDataset = dataset.trainTestSpit(irisDataset.output);

        const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);

        NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

        expect(accuracy >= 90).toBe(true);
    });

    it('Iris Flower Dataset using normalized data', function () {
        // train the neural network
        const irisDataset = NetworkUtil.getIrisDataset();
        const network = NetworkUtil.createIrisNetwork();

        let inputDataset = dataset.trainTestSpit(irisDataset.input);
        let outputDataset = dataset.trainTestSpit(irisDataset.output);

        dataset.normalizeData(inputDataset.train);
        dataset.normalizeData(inputDataset.test);

        const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);

        NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

        expect(accuracy >= 90).toBe(true);
    });
});