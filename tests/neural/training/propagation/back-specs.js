describe('BackPropagation', function () {
    const BackPropagation = require(PATHS.PROPAGATION + 'back');
    const NetworkUtil = require(PATHS.TEST_HELPERS + 'networkUtil');
    const Dataset = require(PATHS.DATASET + 'dataset');
    let network;
    let dataset = new Dataset();
    let train;

    beforeEach(function () {

    });

    it('XOR Dataset', function () {
        // train the neural network
        const XORdataset = NetworkUtil.getXORDataset();
        network = NetworkUtil.createXORNetwork();
        train = new BackPropagation(network, XORdataset.input, XORdataset.output);

        NetworkUtil.trainNetwork(train, {maxIterations: 250});

        const accuracy = NetworkUtil.validateNetwork(network, XORdataset.input, XORdataset.output);

        expect(accuracy >= 75).toBe(true);
    });

    it('Iris Flower Dataset', function () {
        // train the neural network
        const irisDataset = NetworkUtil.getIrisDataset();
        network = NetworkUtil.createIrisNetwork();

        let inputDataset = dataset.trainTestSpit(irisDataset.input);
        let outputDataset = dataset.trainTestSpit(irisDataset.output);

        train = new BackPropagation(network, inputDataset.train, outputDataset.train, .08, .1);

        NetworkUtil.trainNetwork(train, {minError: 0.02, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

        expect(accuracy >= 80).toBe(true);
    });

    it('Iris Flower Dataset using normalized data', function () {
        // train the neural network
        const irisDataset = NetworkUtil.getIrisDataset();
        network = NetworkUtil.createIrisNetwork();

        let inputDataset = dataset.trainTestSpit(irisDataset.input);
        let outputDataset = dataset.trainTestSpit(irisDataset.output);

        dataset.normalizeData(inputDataset.train);
        dataset.normalizeData(inputDataset.test);

        train = new BackPropagation(network, inputDataset.train, outputDataset.train, .3, .3);

        NetworkUtil.trainNetwork(train, {minError: 0.02, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

        expect(accuracy >= 80).toBe(true);
    });
});