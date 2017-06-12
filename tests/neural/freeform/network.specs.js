describe('Freeform Network', function () {
    const FreeformNetwork = require(PATHS.FREEFORM + 'network');
    const FreeformResilientPropagation = require(PATHS.FREEFORM + 'training/propagation/resilient');
    const FreeformBackPropagation = require(PATHS.FREEFORM + 'training/propagation/back');
    const BasicNetwork = require(PATHS.NETWORKS + 'basic');
    const BasicLayer = require(PATHS.LAYERS + 'basic');
    const ActivationSigmoid = require(PATHS.ACTIVATION_FUNCTIONS + 'sigmoid');
    const ActivationTanh = require(PATHS.ACTIVATION_FUNCTIONS + 'tanh');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const ArrayUtils = require(PATHS.UTILS + 'array');


    beforeEach(function () {
    });

    describe('constructor', function () {
        function createXORNetwork() {
            const network = new FreeformNetwork();
            let inputLayer = network.createInputLayer(2);
            let hiddenLayer1 = network.createLayer(3);
            let outputLayer = network.createOutputLayer(1);

            network.connectLayers(inputLayer, hiddenLayer1, new ActivationSigmoid(), 1.0);
            network.connectLayers(hiddenLayer1, outputLayer, new ActivationSigmoid(), 1.0);

            network.reset();

            return network;
        }

        it('should create a free form network based on a basic network', function () {
            // create a neural network
            let basicNetwork = new BasicNetwork();
            basicNetwork.addLayer(new BasicLayer(null, true, 2));
            basicNetwork.addLayer(new BasicLayer(new ActivationSigmoid(), true, 3));
            basicNetwork.addLayer(new BasicLayer(new ActivationSigmoid(), false, 1));
            basicNetwork.reset();

            let freeformNetwork = new FreeformNetwork(basicNetwork);
            expect(basicNetwork.getInputCount()).toEqual(freeformNetwork.getInputCount());
            expect(basicNetwork.getOutputCount()).toEqual(freeformNetwork.getOutputCount());
            expect(basicNetwork.encodedArrayLength()).toEqual(freeformNetwork.encodedArrayLength());
        });

        it('should encode and decode a network', function () {
            // train (and test) a network
            const XORDataset = NetworkUtil.getXORDataset();
            let network = createXORNetwork();

            let rprop = new FreeformResilientPropagation(network, XORDataset.input, XORDataset.output);
            NetworkUtil.trainNetwork(rprop, {minError: 0.01, minIterations: 5});

            // allocate space to encode to
            let encoded = ArrayUtils.newFloatArray(network.encodedArrayLength());

            // encode the network
            network.encodeToArray(encoded);

            // create untrained network
            let untrainedNetwork = createXORNetwork();

            // copy the trained network to the untrained
            untrainedNetwork.decodeFromArray(encoded);

            const untrainedError = untrainedNetwork.calculateError(XORDataset.input, XORDataset.output);
            const trainedError = network.calculateError(XORDataset.input, XORDataset.output);
            // compare error levels
            expect(Math.abs(untrainedError - trainedError)).toBeLessThan(0.01);
        });

        it('LSTM Unit', function () {
            const dataset = NetworkUtil.getXORThroughTimeDataset();
            const network = new FreeformNetwork();
            let inputLayer = network.createInputLayer(1);
            let outputLayer = network.createOutputLayer(1);

            const LSTM = network.createLSTMUnit(2, 3, 2);

            network.connectLayers(inputLayer, LSTM.input);
            network.connectLayers(inputLayer, LSTM.inputGate);
            network.connectLayers(inputLayer, LSTM.outputGate);
            network.connectLayers(inputLayer, LSTM.forgetGate);
            network.connectLayers(LSTM.output, outputLayer);

            network.reset();

            let prop = new FreeformBackPropagation(network, dataset.input, dataset.output);
            NetworkUtil.trainNetwork(prop, {minError: 0.01, minIterations: 5, maxIterations: 20});

            const accuracy = NetworkUtil.validateNetwork(network, dataset.input, dataset.output);

            expect(accuracy).toBeGreaterThan(10);
        });
    });
});