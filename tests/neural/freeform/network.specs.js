fdescribe('Freeform Network', function () {
    const FreeformNetwork = require(PATHS.FREEFORM + 'network');
    const BasicNetwork = require(PATHS.NETWORKS + 'basic');
    const BasicLayer = require(PATHS.LAYERS + 'basic');
    const ActivationSigmoid = require(PATHS.ACTIVATION_FUNCTIONS + 'sigmoid');
    let flatLayer;


    beforeEach(function () {
    });

    describe('constructor',function () {
        it('',function () {
            // create a neural network
            let basicNetwork = new BasicNetwork();
            basicNetwork.addLayer(new BasicLayer(null, true, 2));
            basicNetwork.addLayer(new BasicLayer(new ActivationSigmoid(), true, 3));
            basicNetwork.addLayer(new BasicLayer(new ActivationSigmoid(), false, 1));
            basicNetwork.reset();

            let freeformNetwork = new FreeformNetwork(basicNetwork);
            expect(basicNetwork.getInputCount()).toEqual(freeformNetwork.getInputCount());
            expect(basicNetwork.getOutputCount()).toEqual(freeformNetwork.getOutputCount());
            // expect(basicNetwork.encodedArrayLength()).toEqual(freeformNetwork.encodedArrayLength());
        })
    });
});