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

     it('XOR through time Dataset', function () {
        const XORDataset = Encog.Utils.Datasets.getXORThroughTimeDataSet();

        ElmanPattern.setInputLayer(1);
        ElmanPattern.addHiddenLayer(2);
        ElmanPattern.setOutputLayer(1);

        const network = ElmanPattern.generate();

        // train the neural network
        const train = new Encog.Training.Propagation.Back(network, XORDataset.input, XORDataset.output);

        Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5});
        const accuracy = Encog.Utils.Network.validateNetwork(network, XORDataset.input, XORDataset.output);

        expect(accuracy >= 50).toBe(true);
    });
});
