describe('Freeform Network', function () {
    const Encog = require(PATHS.BASE);
    Encog.Log.options.logLevel = 'silent';
    
    const FreeformNetwork = Encog.Freeform.Network;
    const FreeformResilientPropagation = Encog.Freeform.Training.Propagation;
    const BasicNetwork = Encog.Networks.Basic;
    const BasicLayer = Encog.Layers.Basic;
    const ActivationSigmoid = Encog.ActivationFunctions.Sigmoid;
    const NetworkUtil = Encog.Utils.Network;
    const Datasets = Encog.Utils.Datasets;
    const ArrayUtils = Encog.Preprocessing.Array;


    beforeEach(function () {
    });

    describe('constructor', function () {
        function createXORNetwork() {
            const network = new FreeformNetwork();
            let inputLayer = network.createInputLayer(2);
            let hiddenLayer1 = network.createLayer(3);
            let outputLayer = network.createOutputLayer(1);

            network.connectLayers(inputLayer, hiddenLayer1, new ActivationSigmoid(), 1.0, false);
            network.connectLayers(hiddenLayer1, outputLayer, new ActivationSigmoid(), 1.0, false);

            network.randomize();

            return network;
        }

         test('should create a free form network based on a basic network', function () {
            // create a neural network
            let basicNetwork = new BasicNetwork();
            basicNetwork.addLayer(new BasicLayer(null, true, 2));
            basicNetwork.addLayer(new BasicLayer(new ActivationSigmoid(), true, 3));
            basicNetwork.addLayer(new BasicLayer(new ActivationSigmoid(), false, 1));
            basicNetwork.randomize();

            let freeformNetwork = new FreeformNetwork(basicNetwork);
            expect(basicNetwork.getInputCount()).toEqual(freeformNetwork.getInputCount());
            expect(basicNetwork.getOutputCount()).toEqual(freeformNetwork.getOutputCount());
            expect(basicNetwork.encodedArrayLength()).toEqual(freeformNetwork.encodedArrayLength());
        });

         test('should encode and decode a network', function () {
            // train (and test) a network
            const XORDataset = Datasets.getXORDataSet();
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
    });
});