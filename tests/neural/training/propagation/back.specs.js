describe('BackPropagation', function () {
    const BackPropagation = require(PATHS.PROPAGATION + 'back');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const DataToolbox = require(PATHS.PREPROCESSING + 'dataToolbox');
    const Datasets = require(PATHS.UTILS + 'datasets');
    let network;
    let train;

    beforeEach(function () {

    });

     it('XOR Dataset', function () {
        // train the neural network
        const XORdataset = Datasets.getXORDataSet();
        network = NetworkUtil.createXORNetwork();
        train = new BackPropagation(network, XORdataset.input, XORdataset.output);

        NetworkUtil.trainNetwork(train, {maxIterations: 250});

        const accuracy = NetworkUtil.validateNetwork(network, XORdataset.input, XORdataset.output);

        expect(accuracy).toBeGreaterThan(50);
    });

    it('Iris Flower Dataset using normalized data', function () {
        // train the neural network
        const irisDataset = Datasets.getNormalizedIrisDataSet();
        network = NetworkUtil.createIrisNetwork();

        train = new BackPropagation(network, irisDataset.train.input, irisDataset.train.output, .3, .3);

        NetworkUtil.trainNetwork(train, {minError: 0.02, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, irisDataset.test.input, irisDataset.test.output);

        expect(accuracy).toBeGreaterThan(75);

     });
});