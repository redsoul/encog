describe('BackPropagation', function () {
    const Encog = require(PATHS.BASE);
    Encog.Log.options.logLevel = 'silent';

    const BackPropagation = Encog.Training.Propagation.Back;
    const NetworkUtil = Encog.Utils.Network;
    const Datasets = Encog.Utils.Datasets;
    let network;
    let train;

    beforeEach(function () {

    });

     test('XOR Dataset', function () {
        // train the neural network
        const XORdataset = Datasets.getXORDataSet();
        network = NetworkUtil.createXORNetwork();
        train = new BackPropagation(network, XORdataset.input, XORdataset.output);

        NetworkUtil.trainNetwork(train, {maxIterations: 250});

        const accuracy = NetworkUtil.validateNetwork(network, XORdataset.input, XORdataset.output);

        expect(accuracy).toBeGreaterThan(50);
    });

    test('Iris Flower Dataset using normalized data', function () {
        // train the neural network
        const irisDataset = Datasets.getNormalizedIrisDataSet();
        network = NetworkUtil.createIrisNetwork();

        train = new BackPropagation(network, irisDataset.train.input, irisDataset.train.output, .3, .3);

        NetworkUtil.trainNetwork(train, {minError: 0.02, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, irisDataset.test.input, irisDataset.test.output);

        expect(accuracy).toBeGreaterThan(75);

     });
});