describe('Stochastic Gradient Descent', function () {
    const Encog = require(PATHS.BASE);
    Encog.Log.options.logLevel = 'silent';

    const StochasticGradientDescent = Encog.Training.SGD.StochasticGradientDescent;
    const AdamUpdate = Encog.Training.SGD.Update.Adam;
    const AdaGradUpdate = Encog.Training.SGD.Update.AdaGrad;
    const MomentumUpdate = Encog.Training.SGD.Update.Momentum;
    const NesterovUpdate = Encog.Training.SGD.Update.Nesterov;
    const RmsPropUpdate = Encog.Training.SGD.Update.RmsProp;
    const NetworkUtil = Encog.Utils.Network;
    const Datasets = Encog.Utils.Datasets;
    let network;
    let train;

    function testAsync(runAsync) {
        return (done) => {
            runAsync().then(done, e => { fail(e); done(); });
        };
    }

    describe('Bank Note Authentication Dataset', ()=>{
         test('Adam update', testAsync(async function () {
            // train the neural network
            const bankNoteAuthentication = await Datasets.getBanknoteAuthenticationDataSet();
            network = NetworkUtil.createBankNoteAuthenticationNetwork();

            train = new StochasticGradientDescent(network, bankNoteAuthentication.train.input, bankNoteAuthentication.train.output, new AdamUpdate());

            NetworkUtil.trainNetwork(train, {minError: 0.05, minIterations: 100});
            const accuracy = NetworkUtil.validateNetwork(network, bankNoteAuthentication.test.input, bankNoteAuthentication.test.output);

            expect(accuracy).toBeGreaterThan(50);
        }));

        test('AdaGrad update', testAsync(async function () {
            // train the neural network
            const bankNoteAuthentication = await Datasets.getBanknoteAuthenticationDataSet();
            network = NetworkUtil.createBankNoteAuthenticationNetwork();

            train = new StochasticGradientDescent(network, bankNoteAuthentication.train.input, bankNoteAuthentication.train.output, new AdaGradUpdate());

            NetworkUtil.trainNetwork(train, {minError: 0.05, minIterations: 50, maxIterations:100});
            const accuracy = NetworkUtil.validateNetwork(network, bankNoteAuthentication.test.input, bankNoteAuthentication.test.output);

            expect(accuracy).toBeGreaterThan(40);
        }));

        test('RmsProp update', testAsync(async function () {
            // train the neural network
            const bankNoteAuthentication = await Datasets.getBanknoteAuthenticationDataSet();
            network = NetworkUtil.createBankNoteAuthenticationNetwork();

            train = new StochasticGradientDescent(network, bankNoteAuthentication.train.input, bankNoteAuthentication.train.output, new RmsPropUpdate());

            NetworkUtil.trainNetwork(train, {minError: 0.05, minIterations: 50, maxIterations:100});
            const accuracy = NetworkUtil.validateNetwork(network, bankNoteAuthentication.test.input, bankNoteAuthentication.test.output);

            expect(accuracy).toBeGreaterThan(40);
        }));

        test('Momentum update', testAsync(async function () {
            // train the neural network
            const bankNoteAuthentication = await Datasets.getBanknoteAuthenticationDataSet();
            network = NetworkUtil.createBankNoteAuthenticationNetwork();

            train = new StochasticGradientDescent(network, bankNoteAuthentication.train.input, bankNoteAuthentication.train.output, new MomentumUpdate());

            NetworkUtil.trainNetwork(train, {minError: 0.05, minIterations: 50, maxIterations:100});
            const accuracy = NetworkUtil.validateNetwork(network, bankNoteAuthentication.test.input, bankNoteAuthentication.test.output);

            expect(accuracy).toBeGreaterThan(75);
        }));

        test('Nesterov update', testAsync(async function () {
            // train the neural network
            const bankNoteAuthentication = await Datasets.getBanknoteAuthenticationDataSet();
            network = NetworkUtil.createBankNoteAuthenticationNetwork();

            train = new StochasticGradientDescent(network, bankNoteAuthentication.train.input, bankNoteAuthentication.train.output, new NesterovUpdate());

            NetworkUtil.trainNetwork(train, {minError: 0.05, minIterations: 50, maxIterations:100});
            const accuracy = NetworkUtil.validateNetwork(network, bankNoteAuthentication.test.input, bankNoteAuthentication.test.output);

            expect(accuracy).toBeGreaterThan(40);
        }));
    });
});