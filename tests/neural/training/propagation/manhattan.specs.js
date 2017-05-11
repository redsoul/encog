describe('ManhattanPropagation', function () {
    const ManhattanPropagation = require(PATHS.PROPAGATION + 'manhattan');
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
        train = new ManhattanPropagation(network, XORdataset.input, XORdataset.output, .1, .7);

        NetworkUtil.trainNetwork(train, {maxIterations: 250});

        const accuracy = NetworkUtil.validateNetwork(network, XORdataset.input, XORdataset.output);

        expect(accuracy >= 75).toBe(true);
    });

    it('Iris Flower Dataset', function () {
        // train the neural network
        const irisDataset = NetworkUtil.getIrisDataset();
        network = NetworkUtil.createIrisNetwork();

        let inputDataset = DataToolbox.trainTestSpit(irisDataset.input);
        let outputDataset = DataToolbox.trainTestSpit(irisDataset.output);

        train = new ManhattanPropagation(network, inputDataset.train, outputDataset.train, .03, .7);

        NetworkUtil.trainNetwork(train, {minError: 0.05, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

        expect(accuracy >= 80).toBe(true);
    });

    it('Iris Flower Dataset using normalized data', function () {
        // train the neural network
        const irisDataset = NetworkUtil.getIrisDataset();
        network = NetworkUtil.createIrisNetwork();

        let inputDataset = DataToolbox.trainTestSpit(irisDataset.input);
        let outputDataset = DataToolbox.trainTestSpit(irisDataset.output);

        DataToolbox.normalizeData(inputDataset.train);
        DataToolbox.normalizeData(inputDataset.test);

        train = new ManhattanPropagation(network, inputDataset.train, outputDataset.train, .03, .7);

        NetworkUtil.trainNetwork(train, {minError: 0.05, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

        expect(accuracy >= 80).toBe(true);
    });
});