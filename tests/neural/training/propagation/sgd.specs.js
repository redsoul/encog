describe('Stochastic Gradient Descent', function () {
    const StochasticGradientDescent = require(PATHS.SGD + 'stochasticGradientDescent.js');
    const AdaGradUpdate = require(PATHS.SGD + 'update/adaGradUpdate');
    const MomentumUpdate = require(PATHS.SGD + 'update/momentumUpdate');
    const NesterovUpdate = require(PATHS.SGD + 'update/nesterovUpdate');
    const RmsPropUpdate = require(PATHS.SGD + 'update/rmsPropUpdate');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const Datasets = require(PATHS.UTILS + 'datasets');
    const DataToolbox = require(PATHS.UTILS + 'dataToolbox');
    let network;
    let train;

    beforeEach(function () {

    });

    describe('Momentum update', ()=>{
         it('Iris Flower Dataset using normalized data', function () {
            // train the neural network
            const irisDataset = Datasets.getIrisDataSet();
            network = NetworkUtil.createIrisNetwork();

            let inputDataset = DataToolbox.trainTestSplit(irisDataset.input);
            let outputDataset = DataToolbox.trainTestSplit(irisDataset.output);

            DataToolbox.normalizeData(inputDataset.train);
            DataToolbox.normalizeData(inputDataset.test);

            train = new StochasticGradientDescent(network, inputDataset.train, outputDataset.train, new MomentumUpdate());

            NetworkUtil.trainNetwork(train, {minError: 0.05, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

            expect(accuracy).toBeGreaterThan(59);
        });
    });

    //  it('Iris Flower Dataset using normalized data', function () {
    //     // train the neural network
    //     const irisDataset = Datasets.getIrisDataSet();
    //     network = NetworkUtil.createIrisNetwork();
    //
    //     let inputDataset = DataToolbox.trainTestSplit(irisDataset.input);
    //     let outputDataset = DataToolbox.trainTestSplit(irisDataset.output);
    //
    //     DataToolbox.normalizeData(inputDataset.train);
    //     DataToolbox.normalizeData(inputDataset.test);
    //
    //     train = new ManhattanPropagation(network, inputDataset.train, outputDataset.train, .03, .7);
    //
    //     NetworkUtil.trainNetwork(train, {minError: 0.05, minIterations: 5});
    //     const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);
    //
    //     expect(accuracy >= 75).toBe(true);
    // });
});