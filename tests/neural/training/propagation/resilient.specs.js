describe('ResilientPropagation', function () {
    const ResilientPropagation = require(PATHS.PROPAGATION + 'resilient');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const Datasets = require(PATHS.UTILS + 'datasets');
    const RPROPTypes = ResilientPropagation.getResilientTypes();

    beforeEach(function () {

    });

    describe('Using default Resilient Type (iRPROPp)', function () {
        it('XOR Dataset', function () {
            // train the neural network
            const dataset = Datasets.getXORDataSet();
            const network = NetworkUtil.createXORNetwork();
            const train = new ResilientPropagation(network, dataset.input, dataset.output);

            NetworkUtil.trainNetwork(train);
            const accuracy = NetworkUtil.validateNetwork(network, dataset.input, dataset.output);

            expect(accuracy).toBeGreaterThan(74);
        });

        it('Iris Flower Dataset using normalized data', function () {
            // train the neural network
            const irisDataset = Datasets.getNormalizedIrisDataSet();
            const network = NetworkUtil.createIrisNetwork();

            const train = new ResilientPropagation(network, irisDataset.train.input, irisDataset.train.output);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, irisDataset.test.input, irisDataset.test.output);

            expect(accuracy).toBeGreaterThan(70);
        });
    });

    describe('Using RPROP+ type', function () {
        it('Iris Flower Dataset using normalized data with RPROP+ type', function () {
            // train the neural network
            const irisDataset = Datasets.getNormalizedIrisDataSet();
            const network = NetworkUtil.createIrisNetwork();

            const train = new ResilientPropagation(network, irisDataset.train.input, irisDataset.train.output);
            train.setResilientType(RPROPTypes.RPROPp);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, irisDataset.test.input, irisDataset.test.output);

            expect(accuracy).toBeGreaterThan(75);
        });
    });

    describe('Using RPROP- type', function () {
        it('Iris Flower Dataset using normalized data with RPROP- type', function () {
            // train the neural network
            const irisDataset = Datasets.getNormalizedIrisDataSet();
            const network = NetworkUtil.createIrisNetwork();

            const train = new ResilientPropagation(network, irisDataset.train.input, irisDataset.train.output);
            train.setResilientType(RPROPTypes.RPROPm);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, irisDataset.test.input, irisDataset.test.output);

            expect(accuracy).toBeGreaterThan(75);
        });
    });

    describe('Using iRPROP- type', function () {
        it('Iris Flower Dataset using normalized data with iRPROP- type', function () {
            // train the neural network
            const irisDataset = Datasets.getNormalizedIrisDataSet();
            const network = NetworkUtil.createIrisNetwork();

            const train = new ResilientPropagation(network, irisDataset.train.input, irisDataset.train.output);
            train.setResilientType(RPROPTypes.iRPROPm);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, irisDataset.test.input, irisDataset.test.output);

            expect(accuracy).toBeGreaterThan(80);
        });
    });

    describe('Using ARPROP type', function () {
        it('Iris Flower Dataset using normalized data with ARPROP type', function () {
            // train the neural network
            const irisDataset = Datasets.getNormalizedIrisDataSet();
            const network = NetworkUtil.createIrisNetwork();

            const train = new ResilientPropagation(network, irisDataset.train.input, irisDataset.train.output);
            train.setResilientType(RPROPTypes.ARPROP);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, irisDataset.test.input, irisDataset.test.output);

            expect(accuracy).toBeGreaterThan(80);
        });
    });
});