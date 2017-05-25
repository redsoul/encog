describe('Feed Forward Network', function () {
    const Encog = require('../../index');
    let FeedForward;

    beforeEach(function () {
        FeedForward = new Encog.Patterns.FeedForward();
    });

    it('Iris Flower Dataset', function () {
        const irisDataset = Encog.Utils.Network.getIrisDataset();
        let inputDataset = Encog.Utils.DataToolbox.trainTestSpit(irisDataset.input);
        let outputDataset = Encog.Utils.DataToolbox.trainTestSpit(irisDataset.output);

        FeedForward.setInputLayer(4);
        FeedForward.addHiddenLayer(10);
        FeedForward.addHiddenLayer(5);
        FeedForward.setOutputLayer(3);

        const network = FeedForward.generate();

        Encog.Utils.DataToolbox.normalizeData(inputDataset.train);
        Encog.Utils.DataToolbox.normalizeData(inputDataset.test);

        // train the neural network
        const train = new Encog.Training.Propagation.Resilient(network, inputDataset.train, outputDataset.train);

        Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5, maxIterations: 50});
        const accuracy = Encog.Utils.Network.validateNetwork(network, inputDataset.test, outputDataset.test);

        expect(accuracy >= 75).toBe(true);
    });
});
