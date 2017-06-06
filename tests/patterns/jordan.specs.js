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

    it('XOR through time Dataset', function () {
        const XORDataset = Encog.Utils.Network.getXORThroughTimeDataset();

        JordanPattern.setInputLayer(1);
        JordanPattern.addHiddenLayer(2);
        JordanPattern.setOutputLayer(1);

        const network = JordanPattern.generate();

        // train the neural network
        const train = new Encog.Training.Propagation.Back(network, XORDataset.input, XORDataset.output);

        Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5, maxIterations: 500});
        const accuracy = Encog.Utils.Network.validateNetwork(network, XORDataset.input, XORDataset.output);

        expect(accuracy >= 50).toBe(true);
    });
});
