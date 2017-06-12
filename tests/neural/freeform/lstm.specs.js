xdescribe('LSTM Network', function () {
    const LSTMNetwork = require(PATHS.FREEFORM + 'lstm');
    const FreeformResilientPropagation = require(PATHS.FREEFORM + 'training/propagation/resilient');
    const FreeformBackPropagation = require(PATHS.FREEFORM + 'training/propagation/back');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const DataToolbox = require(PATHS.UTILS + 'dataToolbox');

    beforeEach(function () {
    });

    describe('constructor', function () {
        it('should create a lstm', function () {
            const irisDataset = NetworkUtil.getIrisDataset();
            let inputDataset = DataToolbox.trainTestSpit(irisDataset.input);
            let outputDataset = DataToolbox.trainTestSpit(irisDataset.output);

            DataToolbox.normalizeData(inputDataset.train);
            DataToolbox.normalizeData(inputDataset.test);
            let network = new LSTMNetwork(4, 5, 3);

            let rprop = new FreeformResilientPropagation(network, inputDataset.train, outputDataset.train);
            NetworkUtil.trainNetwork(rprop, {minError: 0.01, minIterations: 5});
        });

        it('should create a lstm', function () {
            const dataset = NetworkUtil.getXORDataset();

            let network = new LSTMNetwork(2, 3, 1);

            let prop = new FreeformResilientPropagation(network, dataset.input, dataset.output);
            NetworkUtil.trainNetwork(prop, {minError: 0.01, minIterations: 5});

            const accuracy = NetworkUtil.validateNetwork(network, dataset.input, dataset.output);

            expect(accuracy).toBeGreaterThan(75);
        });
    });
});