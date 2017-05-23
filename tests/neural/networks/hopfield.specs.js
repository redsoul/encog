describe('Hopfield Network', function () {
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const HopfieldNetwork = require(PATHS.NETWORKS + 'hopfield');
    const HopfieldPattern = require(PATHS.PATTERNS + 'hopfield');
    let network;
    let pattern;

    beforeEach(function () {
        pattern = new HopfieldPattern();
        pattern.setInputLayer(8);
        network = pattern.generate();
        network.addPattern([0, 0, 1, 0, 1, 1, 0, 1]);
    });

    describe('toJSON and fromJSON methods', function () {
        it('should save and restore a network', function () {
            const networkJSON = network.toJSON();
            expect(networkJSON.type).toBe('HopfieldNetwork');
            expect(networkJSON.neuronCount).toBe(8);
            expect(networkJSON.currentState).toEqual([-1, -1, -1, -1, -1, -1, -1, -1]);
            expect(networkJSON.weights.length).toBe(64);

            const newBasicNetwork = new HopfieldNetwork(2);
            newBasicNetwork.fromJSON(networkJSON);

            expect(newBasicNetwork.weights).toEqual(network.weights);
            expect(newBasicNetwork.neuronCount).toBe(network.neuronCount);
        });
    });
});
