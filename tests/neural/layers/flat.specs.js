fdescribe('Flat layer', function () {
    const flatLayer = new require(PATHS.LAYERS + 'flat');
    const NetworkUtil = require(PATHS.UTILS + 'network');
    const ActivationSigmoid = require(PATHS.ACTIVATION_FUNCTIONS + 'sigmoid');
    let network;
    let FlatLayer;


    beforeEach(function () {
        FlatLayer = new flatLayer(ActivationSigmoid, 3);
    });

    describe('toJSON method', function () {
        it('stringify', function () {
            expect(JSON.stringify(FlatLayer)).toBe('{"activation":"ActivationSigmoid","count":3,"biasActivation":0,"contextFedBy":null,"dropoutRate":0}');
        });

        fit('parse', function () {
            let obj = JSON.parse('{"activation":"ActivationSigmoid","count":3,"biasActivation":0,"contextFedBy":null,"dropoutRate":0}');
            let fLayer = new flatLayer();
            Object.assign(fLayer, obj);
            expect(fLayer).toEqual(FlatLayer);
            expect(fLayer.constructor.name).toEqual("FlatLayer");
        });
    });

});
