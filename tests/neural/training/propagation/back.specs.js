describe('BackPropagation', function () {
    const BackPropagation = require(PATHS.PROPAGATION + 'back');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const DataToolbox = require(PATHS.UTILS + 'dataToolbox');
    let network;
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

        expect(accuracy >= 50).toBe(true);
    });

    it('Iris Flower Dataset', function () {
        // train the neural network
        const irisDataset = NetworkUtil.getIrisDataset();
        network = NetworkUtil.createIrisNetwork();

        let inputDataset = DataToolbox.trainTestSpit(irisDataset.input);
        let outputDataset = DataToolbox.trainTestSpit(irisDataset.output);

        train = new BackPropagation(network, inputDataset.train, outputDataset.train, .08, .1);

        NetworkUtil.trainNetwork(train, {minError: 0.02, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

        expect(accuracy >= 75).toBe(true);
    });

    it('Iris Flower Dataset using normalized data', function () {
        // train the neural network
        const irisDataset = NetworkUtil.getIrisDataset();
        network = NetworkUtil.createIrisNetwork();

        let inputDataset = DataToolbox.trainTestSpit(irisDataset.input);
        let outputDataset = DataToolbox.trainTestSpit(irisDataset.output);

        DataToolbox.normalizeData(inputDataset.train);
        DataToolbox.normalizeData(inputDataset.test);

        train = new BackPropagation(network, inputDataset.train, outputDataset.train, .3, .3);

        NetworkUtil.trainNetwork(train, {minError: 0.02, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

        expect(accuracy >= 75).toBe(true);
    });
});