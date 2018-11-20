describe('ManhattanPropagation', function () {
    const ManhattanPropagation = require(PATHS.PROPAGATION + 'manhattan');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const Datasets = require(PATHS.UTILS + 'datasets');
    const DataToolbox = require(PATHS.PREPROCESSING + 'dataToolbox');
    let network;
    let train;

    beforeEach(function () {

    });

     test('XOR Dataset', function () {
        // train the neural network
        const XORdataset = Datasets.getXORDataSet();
        network = NetworkUtil.createXORNetwork();
        train = new ManhattanPropagation(network, XORdataset.input, XORdataset.output, .1, .7);

        NetworkUtil.trainNetwork(train, {maxIterations: 250});

        const accuracy = NetworkUtil.validateNetwork(network, XORdataset.input, XORdataset.output);

        expect(accuracy).toBeGreaterThan(75);
    });

    test('Iris Flower Dataset using normalized data', function () {
        // train the neural network
        const irisDataset = Datasets.getNormalizedIrisDataSet();
        network = NetworkUtil.createIrisNetwork();

        train = new ManhattanPropagation(network, irisDataset.train.input, irisDataset.train.output, .03, .7);

        NetworkUtil.trainNetwork(train, {minError: 0.05, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, irisDataset.test.input, irisDataset.test.output);

        expect(accuracy).toBeGreaterThan(75);
    });
});