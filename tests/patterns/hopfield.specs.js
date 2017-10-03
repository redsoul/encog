describe('Hopfield Pattern', function () {
    const Encog = require('../../index');
    const _ = require('lodash');
    const ArrayUtils = require(PATHS.PREPROCESSING + 'array');
    let HopfieldPattern;

    beforeEach(function () {
        HopfieldPattern = new Encog.Patterns.Hopfield();
    });

    it('Should throw and error when trying to add more than one hidden layer', function () {
        expect(()=>HopfieldPattern.addHiddenLayer(10)).toThrow()
    });

    it('Should throw and error when trying to set the output layer', function () {
        expect(()=>HopfieldPattern.setOutputLayer(10)).toThrow()
    });

    it('Should throw and error when add a pattern with different size than the neuron count', function () {
        HopfieldPattern.setInputLayer(4);
        const network = HopfieldPattern.generate();
        expect(()=>network.addPattern([1,2,3])).toThrow();
    });

    it('Letters pattern Dataset', function () {
        const hopfieldPatterns = Encog.Utils.Datasets.getHopfieldPatterns();

        HopfieldPattern.setInputLayer(35);
        const network = HopfieldPattern.generate();

        _.each(hopfieldPatterns, function (pattern) {
            network.addPattern(pattern);
        });

        network.runUntilStable(10);
        const input = [
            0, 0, 0, 0, 0,
            0, 1, 1, 1, 0,
            0, 0, 0, 0, 0,
            0, 1, 1, 0, 0,
            0, 0, 0, 0, 0,
            0, 1, 1, 1, 0,
            0, 0, 0, 0, 0
        ];
        const result = network.compute(input);

        expect(result).toEqual([
            0, 0, 0, 0, 0,
            0, 1, 1, 1, 0,
            0, 1, 0, 0, 0,
            0, 1, 1, 0, 0,
            0, 1, 0, 0, 0,
            0, 1, 1, 1, 0,
            0, 0, 0, 0, 0
        ]);
    });
});
