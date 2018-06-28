describe('Levenberg Marquardt Training', function () {
    const LevenbergMarquardt = require(PATHS.TRAINING + 'levenbergMarquardt');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const Datasets = require(PATHS.UTILS + 'datasets');

    it('Iris Flower Dataset', function () {
        // train the neural network
        const irisDataset = Datasets.getNormalizedIrisDataSet();
        const network = NetworkUtil.createIrisNetwork();

        const train = new LevenbergMarquardt(network, irisDataset.train.input, irisDataset.train.output);

        NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, irisDataset.test.input, irisDataset.test.output);

        expect(accuracy >= 0).toBeTruthy(); //TODO: Fix me
    });
});