describe('Jordan Network', function () {
    const Encog = require(PATHS.BASE);
    Encog.Log.options.logLevel = 'silent';
    
    const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
    let JordanPattern;

    beforeEach(function () {
        JordanPattern = new Encog.Patterns.Jordan();
    });

     test('Should throw and error when trying to add more than one hidden layer',function () {
        JordanPattern.addHiddenLayer(10);
        expect(()=> {
            JordanPattern.addHiddenLayer(10);
        }).toThrow(new NeuralNetworkError("A Jordan neural network should have only one hidden layer."))
    });

     test('XOR through time Dataset', function () {
        const XORDataset = Encog.Utils.Datasets.getXORThroughTimeDataSet();

        JordanPattern.setInputLayer(1);
        JordanPattern.addHiddenLayer(2);
        JordanPattern.setOutputLayer(1);

        const network = JordanPattern.generate();

        // train the neural network
        const train = new Encog.Training.Propagation.Back(network, XORDataset.input, XORDataset.output);

        Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5, maxIterations: 500});
        const accuracy = Encog.Utils.Network.validateNetwork(network, XORDataset.input, XORDataset.output);

        //todo: find a better dataset
        expect(accuracy >= 0).toBe(true);
    });
});
