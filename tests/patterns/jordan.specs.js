xdescribe('Jordan Network', function () {
    const Encog = require('../../index');
    let JordanPattern;

    beforeEach(function () {
        JordanPattern = new Encog.Patterns.Jordan();
    });

    it('Iris Flower Dataset', function () {
        const irisDataset = Encog.Utils.Network.getIrisDataset();
        let inputDataset = Encog.Utils.DataToolbox.trainTestSpit(irisDataset.input);
        let outputDataset = Encog.Utils.DataToolbox.trainTestSpit(irisDataset.output);

        JordanPattern.inputNeurons = 4;
        JordanPattern.hiddenNeurons = 10;
        JordanPattern.outputNeurons = 3;

        const network = JordanPattern.generate();

        Encog.Utils.DataToolbox.normalizeData(inputDataset.train);
        Encog.Utils.DataToolbox.normalizeData(inputDataset.test);

        // train the neural network
        const train = new Encog.Training.Propagation.Resilient(network, inputDataset.train, outputDataset.train);

        Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5, maxIterations: 50});
        const accuracy = Encog.Utils.Network.validateNetwork(network, inputDataset.test, outputDataset.test);

        console.log('Accuracy:', accuracy);
    });
});
