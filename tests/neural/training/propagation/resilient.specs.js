describe('ResilientPropagation', function () {
    const ResilientPropagation = require(PATHS.PROPAGATION + 'resilient');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const DataToolbox = require(PATHS.UTILS + 'dataToolbox');
    const RPROPTypes = ResilientPropagation.getResilientTypes();

    beforeEach(function () {

    });

    describe('Using default Resilient Type (iRPROPp)', function () {
        it('XOR Dataset', function () {
            // train the neural network
            const dataset = NetworkUtil.getXORDataset();
            const network = NetworkUtil.createXORNetwork();
            const train = new ResilientPropagation(network, dataset.input, dataset.output);

            NetworkUtil.trainNetwork(train);
            const accuracy = NetworkUtil.validateNetwork(network, dataset.input, dataset.output);

            expect(accuracy >= 75).toBe(true);
        });

        it('Iris Flower Dataset', function () {
            // train the neural network
            const irisDataset = NetworkUtil.getIrisDataset();
            const network = NetworkUtil.createIrisNetwork();

            let inputDataset = DataToolbox.trainTestSpit(irisDataset.input);
            let outputDataset = DataToolbox.trainTestSpit(irisDataset.output);

            const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

            expect(accuracy >= 80).toBe(true);
        });

        it('Iris Flower Dataset using normalized data', function () {
            // train the neural network
            const irisDataset = NetworkUtil.getIrisDataset();
            const network = NetworkUtil.createIrisNetwork();

            let inputDataset = DataToolbox.trainTestSpit(irisDataset.input);
            let outputDataset = DataToolbox.trainTestSpit(irisDataset.output);

            DataToolbox.normalizeData(inputDataset.train);
            DataToolbox.normalizeData(inputDataset.test);

            const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

            expect(accuracy >= 70).toBe(true);
        });
    });

    describe('Using RPROP+ type', function () {
        it('Iris Flower Dataset using normalized data with RPROP+ type', function () {
            // train the neural network
            const irisDataset = NetworkUtil.getIrisDataset();
            const network = NetworkUtil.createIrisNetwork();

            let inputDataset = DataToolbox.trainTestSpit(irisDataset.input);
            let outputDataset = DataToolbox.trainTestSpit(irisDataset.output);

            DataToolbox.normalizeData(inputDataset.train);
            DataToolbox.normalizeData(inputDataset.test);

            const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);
            train.setResilientType(RPROPTypes.RPROPp);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

            expect(accuracy >= 75).toBe(true);
        });
    });

    describe('Using RPROP- type', function () {
        it('Iris Flower Dataset using normalized data with RPROP- type', function () {
            // train the neural network
            const irisDataset = NetworkUtil.getIrisDataset();
            const network = NetworkUtil.createIrisNetwork();

            let inputDataset = DataToolbox.trainTestSpit(irisDataset.input);
            let outputDataset = DataToolbox.trainTestSpit(irisDataset.output);

            DataToolbox.normalizeData(inputDataset.train);
            DataToolbox.normalizeData(inputDataset.test);

            const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);
            train.setResilientType(RPROPTypes.RPROPm);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

            expect(accuracy >= 75).toBe(true);
        });
    });

    describe('Using iRPROP- type', function () {
        it('Iris Flower Dataset using normalized data with iRPROP- type', function () {
            // train the neural network
            const irisDataset = NetworkUtil.getIrisDataset();
            const network = NetworkUtil.createIrisNetwork();

            let inputDataset = DataToolbox.trainTestSpit(irisDataset.input);
            let outputDataset = DataToolbox.trainTestSpit(irisDataset.output);

            DataToolbox.normalizeData(inputDataset.train);
            DataToolbox.normalizeData(inputDataset.test);

            const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);
            train.setResilientType(RPROPTypes.iRPROPm);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

            expect(accuracy >= 80).toBe(true);
        });
    });

    describe('Using ARPROP type', function () {
        it('Iris Flower Dataset using normalized data with ARPROP type', function () {
            // train the neural network
            const irisDataset = NetworkUtil.getIrisDataset();
            const network = NetworkUtil.createIrisNetwork();

            let inputDataset = DataToolbox.trainTestSpit(irisDataset.input);
            let outputDataset = DataToolbox.trainTestSpit(irisDataset.output);

            DataToolbox.normalizeData(inputDataset.train);
            DataToolbox.normalizeData(inputDataset.test);

            const train = new ResilientPropagation(network, inputDataset.train, outputDataset.train);
            train.setResilientType(RPROPTypes.ARPROP);

            NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
            const accuracy = NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);

            expect(accuracy >= 80).toBe(true);
        });
    });
});