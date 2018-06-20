describe('ResilientPropagation', function () {
    const ResilientPropagation = require(PATHS.PROPAGATION + 'resilient');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const DataToolbox = require(PATHS.UTILS + 'dataToolbox');
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

            expect(accuracy).toBeGreaterThan(75);
        });

        it('Iris Flower Dataset', function () {
            // train the neural network
            const irisDataset = Datasets.getIrisDataSet();
            const network = NetworkUtil.createIrisNetwork();

            let inputDataset = DataToolbox.trainTestSplit(irisDataset.input);
            let outputDataset = DataToolbox.trainTestSplit(irisDataset.output);

            const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

            expect(accuracy).toBeGreaterThan(80);
        });

        it('Iris Flower Dataset using normalized data', function () {
            // train the neural network
            const irisDataset = Datasets.getIrisDataSet();
            const network = NetworkUtil.createIrisNetwork();

            let inputDataset = DataToolbox.trainTestSplit(irisDataset.input);
            let outputDataset = DataToolbox.trainTestSplit(irisDataset.output);

            DataToolbox.normalizeData(inputDataset.train);
            DataToolbox.normalizeData(inputDataset.test);

            const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

            expect(accuracy).toBeGreaterThan(70);
        });
    });

    describe('Using RPROP+ type', function () {
        it('Iris Flower Dataset using normalized data with RPROP+ type', function () {
            // train the neural network
            const irisDataset = Datasets.getIrisDataSet();
            const network = NetworkUtil.createIrisNetwork();

            let inputDataset = DataToolbox.trainTestSplit(irisDataset.input);
            let outputDataset = DataToolbox.trainTestSplit(irisDataset.output);

            DataToolbox.normalizeData(inputDataset.train);
            DataToolbox.normalizeData(inputDataset.test);

            const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);
            train.setResilientType(RPROPTypes.RPROPp);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

            expect(accuracy).toBeGreaterThan(75);
        });
    });

    describe('Using RPROP- type', function () {
        it('Iris Flower Dataset using normalized data with RPROP- type', function () {
            // train the neural network
            const irisDataset = Datasets.getIrisDataSet();
            const network = NetworkUtil.createIrisNetwork();

            let inputDataset = DataToolbox.trainTestSplit(irisDataset.input);
            let outputDataset = DataToolbox.trainTestSplit(irisDataset.output);

            DataToolbox.normalizeData(inputDataset.train);
            DataToolbox.normalizeData(inputDataset.test);

            const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);
            train.setResilientType(RPROPTypes.RPROPm);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

            expect(accuracy).toBeGreaterThan(75);
        });
    });

    describe('Using iRPROP- type', function () {
        it('Iris Flower Dataset using normalized data with iRPROP- type', function () {
            // train the neural network
            const irisDataset = Datasets.getIrisDataSet();
            const network = NetworkUtil.createIrisNetwork();

            let inputDataset = DataToolbox.trainTestSplit(irisDataset.input);
            let outputDataset = DataToolbox.trainTestSplit(irisDataset.output);

            DataToolbox.normalizeData(inputDataset.train);
            DataToolbox.normalizeData(inputDataset.test);

            const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);
            train.setResilientType(RPROPTypes.iRPROPm);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

            expect(accuracy).toBeGreaterThan(80);
        });
    });

    describe('Using ARPROP type', function () {
        it('Iris Flower Dataset using normalized data with ARPROP type', function () {
            // train the neural network
            const irisDataset = Datasets.getIrisDataSet();
            const network = NetworkUtil.createIrisNetwork();

            let inputDataset = DataToolbox.trainTestSplit(irisDataset.input);
            let outputDataset = DataToolbox.trainTestSplit(irisDataset.output);

            DataToolbox.normalizeData(inputDataset.train);
            DataToolbox.normalizeData(inputDataset.test);

            const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);
            train.setResilientType(RPROPTypes.ARPROP);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

            expect(accuracy).toBeGreaterThan(80);
        });
    });
});