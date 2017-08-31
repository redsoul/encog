xdescribe('Levenberg Marquardt Training', function () {
    const LevenbergMarquardt = require(PATHS.TRAINING + 'levenbergMarquardt');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const Datasets = require(PATHS.UTILS + 'datasets');
    const DataToolbox = require(PATHS.UTILS + 'dataToolbox');

    beforeEach(function () {

    });

    it('XOR Dataset', function () {
        // train the neural network
        const dataset = Datasets.getXORDataset();
        const network = NetworkUtil.createXORNetwork();
        const train = new LevenbergMarquardt(network, dataset.input, dataset.output);

        NetworkUtil.trainNetwork(train);
        const accuracy = NetworkUtil.validateNetwork(network, dataset.input, dataset.output);

        expect(accuracy >= 90).toBe(true);
    });

    it('Iris Flower Dataset', function () {
        // train the neural network
        const dataset = Datasets.getIrisDataset();
        const network = NetworkUtil.createIrisNetwork();

        let inputDataset = DataToolbox.trainTestSplit(dataset.input);
        let outputDataset = DataToolbox.trainTestSplit(dataset.output);

        const train = new LevenbergMarquardt(network, inputDataset.train, outputDataset.train);

        NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

        expect(accuracy >= 90).toBe(true);
    });
});