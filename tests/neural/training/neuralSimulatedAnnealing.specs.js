xdescribe('Neural Simulated Annealing Training', function () {
    const NeuralSimulatedAnnealing = require(PATHS.TRAINING + 'neuralSimulatedAnnealing');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const TrainingSetScore = require(PATHS.SCORE + 'trainingSet');
    const DataToolbox = require(PATHS.UTILS + 'dataToolbox');

    beforeEach(function () {

    });

    it('XOR Dataset', function () {
        // train the neural network
        const dataset = NetworkUtil.getXORDataset();
        const network = NetworkUtil.createXORNetwork();
        const score = new TrainingSetScore(dataset.input, dataset.output);
        const train = new NeuralSimulatedAnnealing(network, score, 10, 2, 100);

        NetworkUtil.trainNetwork(train);
        const accuracy = NetworkUtil.validateNetwork(network, dataset.input, dataset.output);

        expect(accuracy >= 90).toBe(true);
    });

    it('Iris Flower Dataset', function () {
        // train the neural network
        const dataset = NetworkUtil.getIrisDataset();
        const network = NetworkUtil.createIrisNetwork();

        let inputDataset = DataToolbox.trainTestSpit(dataset.input);
        let outputDataset = DataToolbox.trainTestSpit(dataset.output);

        const score = new TrainingSetScore(inputDataset.train, outputDataset.train);
        const train = new NeuralSimulatedAnnealing(network, score, 10, 2, 100);

        NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

        expect(accuracy >= 90).toBe(true);
    });
});