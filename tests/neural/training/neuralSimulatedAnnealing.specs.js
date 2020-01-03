xdescribe('Neural Simulated Annealing Training', function () {
    const Encog = require(PATHS.BASE);
    Encog.Log.options.logLevel = 'silent';

    const NeuralSimulatedAnnealing = Encog.Training.NeuralSimulatedAnnealing;
    const NetworkUtil = Encog.Utils.Network;
    const TrainingSetScore = require(PATHS.SCORE + 'trainingSet');
    const DataToolbox = Encog.Preprocessing.DataToolbox;
    const Datasets = Encog.Utils.Datasets;

    beforeEach(function () {

    });

    test('XOR Dataset', function () {
        // train the neural network
        const dataset = Datasets.getXORDataset();
        const network = NetworkUtil.createXORNetwork();
        const score = new TrainingSetScore(dataset.input, dataset.output);
        const train = new NeuralSimulatedAnnealing(network, score, 10, 2, 100);

        NetworkUtil.trainNetwork(train);
        const accuracy = NetworkUtil.validateNetwork(network, dataset.input, dataset.output);

        expect(accuracy).toBeGreaterThan(90);
    });

    test('Iris Flower Dataset', function () {
        // train the neural network
        const dataset = Datasets.getIrisDataset();
        const network = NetworkUtil.createIrisNetwork();

        let inputDataset = DataToolbox.trainTestSplit(dataset.input);
        let outputDataset = DataToolbox.trainTestSplit(dataset.output);

        const score = new TrainingSetScore(inputDataset.train, outputDataset.train);
        const train = new NeuralSimulatedAnnealing(network, score, 10, 2, 100);

        NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
        const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

        expect(accuracy).toBeGreaterThan(90);
    });
});