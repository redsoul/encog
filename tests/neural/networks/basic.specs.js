describe('Basic Network', function () {
    const Encog = require(PATHS.BASE);
    Encog.Log.options.logLevel = 'silent';

    const NetworkUtil = Encog.Utils.Network;
    let network;
    let JordanPattern = Encog.Patterns.Jordan;
    let BasicNetwork = Encog.Networks.Basic;
    let jordanPattern;

    beforeEach(function () {

    });

    describe('toJSON and fromJSON methods', function () {
         test('should save and restore a network without context', function () {
            network = NetworkUtil.createXORNetwork();

            const networkJSON = network.toJSON();
            expect(networkJSON.type).toBe('BasicNetwork');
            expect(networkJSON.weights.length).toBe(17);
            expect(networkJSON.activationFunctions.length).toBe(3);
            expect(networkJSON.layerOutput.length).toBe(9);
            expect(networkJSON.biasActivation.length).toBe(3);

            const newBasicNetwork = new BasicNetwork();
            newBasicNetwork.fromJSON(networkJSON);

            expect(newBasicNetwork.getFlat().weights).toEqual(network.getFlat().weights);
        });

         test('should save and restore a network with context', function () {
            jordanPattern = new JordanPattern();
            jordanPattern.setInputLayer(4);
            jordanPattern.addHiddenLayer(10);
            jordanPattern.setOutputLayer(3);

            network = jordanPattern.generate();

            const networkJSON = network.toJSON();
            expect(networkJSON.type).toBe('BasicNetwork');
            expect(networkJSON.weights.length).toBe(92);
            expect(networkJSON.activationFunctions.length).toBe(3);
            expect(networkJSON.layerOutput.length).toBe(22);
            expect(networkJSON.biasActivation.length).toBe(3);

            const newBasicNetwork = new BasicNetwork();
            newBasicNetwork.fromJSON(networkJSON);

            expect(newBasicNetwork.getFlat().weights).toEqual(network.getFlat().weights);
        })
    });
});
