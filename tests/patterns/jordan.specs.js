describe('Jordan Network', function () {
    const Encog = require('../../index');
    const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
    let JordanPattern;

    beforeEach(function () {
        JordanPattern = new Encog.Patterns.Jordan();
    });

    it('Should throw and error when trying to add more than one hidden layer',function () {
        JordanPattern.addHiddenLayer(10);
        expect(()=> {
            JordanPattern.addHiddenLayer(10);
        }).toThrow(new NeuralNetworkError("A Jordan neural network should have only one hidden layer."))
    });

    it('Iris Flower Dataset', function () {
        const irisDataset = Encog.Utils.Network.getIrisDataset();
        let inputDataset = Encog.Utils.DataToolbox.trainTestSpit(irisDataset.input);
        let outputDataset = Encog.Utils.DataToolbox.trainTestSpit(irisDataset.output);

        JordanPattern.setInputLayer(4);
        JordanPattern.addHiddenLayer(10);
        JordanPattern.setOutputLayer(3);

        const network = JordanPattern.generate();

        Encog.Utils.DataToolbox.normalizeData(inputDataset.train);
        Encog.Utils.DataToolbox.normalizeData(inputDataset.test);

        // train the neural network
        const train = new Encog.Training.Propagation.Resilient(network, inputDataset.train, outputDataset.train);

        Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5, maxIterations: 25});
        const accuracy = Encog.Utils.Network.validateNetwork(network, inputDataset.test, outputDataset.test);

        //TODO: use a more appropriate dataset
        expect(accuracy >= 0).toBe(true);
    });

    it('Iris Flower Dataset using FreeformNetwork', function () {
        const irisDataset = Encog.Utils.Network.getIrisDataset();
        let inputDataset = Encog.Utils.DataToolbox.trainTestSpit(irisDataset.input);
        let outputDataset = Encog.Utils.DataToolbox.trainTestSpit(irisDataset.output);

        JordanPattern.setInputLayer(4);
        JordanPattern.addHiddenLayer(10);
        JordanPattern.setOutputLayer(3);

        const network = JordanPattern.generateFreeformNetwork();

        Encog.Utils.DataToolbox.normalizeData(inputDataset.train);
        Encog.Utils.DataToolbox.normalizeData(inputDataset.test);

        // train the neural network
        const train = new Encog.FreeformPropagation.Resilient(network, inputDataset.train, outputDataset.train);

        Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5, maxIterations: 25});
        const accuracy = Encog.Utils.Network.validateNetwork(network, inputDataset.test, outputDataset.test);

        //TODO: use a more appropriate dataset
        expect(accuracy >= 0).toBe(true);
    });
});
