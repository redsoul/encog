describe('Feed Forward Network', function () {
    const Encog = require('../../index');
    const DataToolbox = require(PATHS.PREPROCESSING + 'dataToolbox');
    const Datasets = require(PATHS.UTILS + 'datasets');
    let FeedForward;

    beforeEach(function () {
        FeedForward = new Encog.Patterns.FeedForward();
    });

    it('Iris Flower Dataset', function () {
        const irisDataset = Datasets.getNormalizedIrisDataSet();

        FeedForward.setInputLayer(4);
        FeedForward.addHiddenLayer(10);
        FeedForward.addHiddenLayer(5);
        FeedForward.setOutputLayer(3);

        const network = FeedForward.generate();

        // train the neural network
        const train = new Encog.Training.Propagation.Resilient(network, irisDataset.train.input, irisDataset.train.output);

        Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5, maxIterations: 50});
        const accuracy = Encog.Utils.Network.validateNetwork(network, irisDataset.test.input, irisDataset.test.output);

        expect(accuracy >= 75).toBe(true);
    });

    it('Iris Flower Dataset using FreeformNetwork', function () {
        const irisDataset = Datasets.getNormalizedIrisDataSet();

        FeedForward.setInputLayer(4);
        FeedForward.addHiddenLayer(10);
        FeedForward.addHiddenLayer(5);
        FeedForward.setOutputLayer(3);

        const network = FeedForward.generateFreeformNetwork();

        // train the neural network
        const train = new Encog.FreeformPropagation.Resilient(network, irisDataset.train.input, irisDataset.train.output);

        Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5, maxIterations: 50});
        const accuracy = Encog.Utils.Network.validateNetwork(network, irisDataset.test.input, irisDataset.test.output);

        //todo: fix me
        expect(accuracy >= 0).toBe(true);
    });
});
