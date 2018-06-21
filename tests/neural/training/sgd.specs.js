describe('Stochastic Gradient Descent', function () {
    const StochasticGradientDescent = require(PATHS.SGD + 'stochasticGradientDescent.js');
    const AdamUpdate = require(PATHS.SGD + 'update/adamUpdate');
    const AdaGradUpdate = require(PATHS.SGD + 'update/adaGradUpdate');
    const MomentumUpdate = require(PATHS.SGD + 'update/momentumUpdate');
    const NesterovUpdate = require(PATHS.SGD + 'update/nesterovUpdate');
    const RmsPropUpdate = require(PATHS.SGD + 'update/rmsPropUpdate');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const Datasets = require(PATHS.UTILS + 'datasets');
    const DataToolbox = require(PATHS.PREPROCESSING + 'dataToolbox');
    let network;
    let train;

    function testAsync(runAsync) {
        return (done) => {
            runAsync().then(done, e => { fail(e); done(); });
        };
    }

    beforeEach(function () {

    });

    describe('Bank Note Authentication Dataset', ()=>{
         it('Adam update', testAsync(async function () {
            // train the neural network
            const bankNoteAuthentication = await Datasets.getBanknoteAuthenticationDataSet();
            network = NetworkUtil.createBankNoteAuthenticationNetwork();

            train = new StochasticGradientDescent(network, bankNoteAuthentication.train.input, bankNoteAuthentication.train.output, new AdamUpdate());

            NetworkUtil.trainNetwork(train, {minError: 0.05, minIterations: 100});
            const accuracy = NetworkUtil.validateNetwork(network, bankNoteAuthentication.test.input, bankNoteAuthentication.test.output);

            expect(accuracy).toBeGreaterThan(75);
        }));

        it('AdaGrad update', testAsync(async function () {
            // train the neural network
            const bankNoteAuthentication = await Datasets.getBanknoteAuthenticationDataSet();
            network = NetworkUtil.createBankNoteAuthenticationNetwork();

            train = new StochasticGradientDescent(network, bankNoteAuthentication.train.input, bankNoteAuthentication.train.output, new AdaGradUpdate());

            NetworkUtil.trainNetwork(train, {minError: 0.05, minIterations: 50, maxIterations:100});
            const accuracy = NetworkUtil.validateNetwork(network, bankNoteAuthentication.test.input, bankNoteAuthentication.test.output);

            expect(accuracy).toBeGreaterThan(45);
        }));

        it('RmsProp update', testAsync(async function () {
            // train the neural network
            const bankNoteAuthentication = await Datasets.getBanknoteAuthenticationDataSet();
            network = NetworkUtil.createBankNoteAuthenticationNetwork();

            train = new StochasticGradientDescent(network, bankNoteAuthentication.train.input, bankNoteAuthentication.train.output, new RmsPropUpdate());

            NetworkUtil.trainNetwork(train, {minError: 0.05, minIterations: 50, maxIterations:100});
            const accuracy = NetworkUtil.validateNetwork(network, bankNoteAuthentication.test.input, bankNoteAuthentication.test.output);

            expect(accuracy).toBeGreaterThan(40);
        }));

        it('Momentum update', testAsync(async function () {
            // train the neural network
            const bankNoteAuthentication = await Datasets.getBanknoteAuthenticationDataSet();
            network = NetworkUtil.createBankNoteAuthenticationNetwork();

            train = new StochasticGradientDescent(network, bankNoteAuthentication.train.input, bankNoteAuthentication.train.output, new MomentumUpdate());

            NetworkUtil.trainNetwork(train, {minError: 0.05, minIterations: 50, maxIterations:100});
            const accuracy = NetworkUtil.validateNetwork(network, bankNoteAuthentication.test.input, bankNoteAuthentication.test.output);

            expect(accuracy).toBeGreaterThan(75);
        }));

        it('Nesterov update', testAsync(async function () {
            // train the neural network
            const bankNoteAuthentication = await Datasets.getBanknoteAuthenticationDataSet();
            network = NetworkUtil.createBankNoteAuthenticationNetwork();

            train = new StochasticGradientDescent(network, bankNoteAuthentication.train.input, bankNoteAuthentication.train.output, new NesterovUpdate());

            NetworkUtil.trainNetwork(train, {minError: 0.05, minIterations: 50, maxIterations:100});
            const accuracy = NetworkUtil.validateNetwork(network, bankNoteAuthentication.test.input, bankNoteAuthentication.test.output);

            expect(accuracy).toBeGreaterThan(40);
        }));
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