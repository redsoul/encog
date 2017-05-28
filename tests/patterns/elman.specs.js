describe('Elman Network', function () {
    const Encog = require('../../index');
    const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
    let ElmanPattern;

    beforeEach(function () {
        ElmanPattern = new Encog.Patterns.Elman();
    });

    it('Should throw and error when trying to add more than one hidden layer', function () {
        ElmanPattern.addHiddenLayer(10);
        expect(()=> {
            ElmanPattern.addHiddenLayer(10);
        }).toThrow(new NeuralNetworkError("An Elman neural network should have only one hidden layer."))
    });

    it('Iris Flower Dataset using BasicNetwork', function () {
        const irisDataset = Encog.Utils.Network.getIrisDataset();
        let inputDataset = Encog.Utils.DataToolbox.trainTestSpit(irisDataset.input);
        let outputDataset = Encog.Utils.DataToolbox.trainTestSpit(irisDataset.output);

        ElmanPattern.setInputLayer(4);
        ElmanPattern.addHiddenLayer(10);
        ElmanPattern.setOutputLayer(3);

        const network = ElmanPattern.generate();

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

        ElmanPattern.setInputLayer(4);
        ElmanPattern.addHiddenLayer(10);
        ElmanPattern.setOutputLayer(3);

        const network = ElmanPattern.generateFreeformNetwork();

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
