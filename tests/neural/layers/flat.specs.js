xdescribe('Flat layer', function () {
    const FlatLayer = new require(PATHS.LAYERS + 'flat');
    const ActivationSigmoid = require(PATHS.ACTIVATION_FUNCTIONS + 'sigmoid');
    let flatLayer;


    beforeEach(function () {
        flatLayer = new FlatLayer(ActivationSigmoid, 3);
    });

});
