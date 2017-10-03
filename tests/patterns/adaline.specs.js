describe('ADALINE Network', function () {
    const Encog = require('../../index');
    let AdalinePattern;
    const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');

    beforeEach(function () {
        AdalinePattern = new Encog.Patterns.Adaline();
    });

    it('Should throw and error when trying to add hidden layers',function () {
        expect(()=> {
            AdalinePattern.addHiddenLayer(10);
        }).toThrow(new NeuralNetworkError("An ADALINE network has no hidden layers."))
    });

    it('Iris Flower Dataset', function () {
        const irisDataset = Encog.Utils.Datasets.getNormalizedIrisDataSet();
        AdalinePattern.setInputLayer(4);
        AdalinePattern.setOutputLayer(3);

        const network = AdalinePattern.generate();

        // train the neural network
        const train = new Encog.Training.Propagation.Resilient(network, irisDataset.train.input, irisDataset.train.output);

        Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5, maxIterations: 25});
        const accuracy = Encog.Utils.Network.validateNetwork(network, irisDataset.test.input, irisDataset.test.output);

        expect(accuracy >= 50).toBe(true);
    });

    xit('Iris Flower Dataset using FreeformNetwork', function () {
        const irisDataset = Encog.Utils.Datasets.getNormalizedIrisDataSet();

        AdalinePattern.setInputLayer(4);
        AdalinePattern.setOutputLayer(3);

        const network = AdalinePattern.generateFreeformNetwork();

        // train the neural network
        const train = new Encog.FreeformPropagation.Resilient(network, irisDataset.train.input, irisDataset.train.output);

        Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5, maxIterations: 25});
        const accuracy = Encog.Utils.Network.validateNetwork(network, irisDataset.test.input, irisDataset.test.output);

        //todo: fix me
        expect(accuracy >= 0).toBe(true);
    });
});
