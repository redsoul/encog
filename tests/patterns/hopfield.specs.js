describe('Hopfield Pattern', function () {
    const Encog = require(PATHS.BASE);
    Encog.Log.options.logLevel = 'silent';
    
    const _ = require('lodash');
    let HopfieldPattern;

    beforeEach(function () {
        HopfieldPattern = new Encog.Patterns.Hopfield();
    });

     test('Should throw and error when trying to add more than one hidden layer', function () {
        expect(()=>HopfieldPattern.addHiddenLayer(10)).toThrow()
    });

     test('Should throw and error when trying to set the output layer', function () {
        expect(()=>HopfieldPattern.setOutputLayer(10)).toThrow()
    });

     test('Should throw and error when add a pattern with different size than the neuron count', function () {
        HopfieldPattern.setInputLayer(4);
        const network = HopfieldPattern.generate();
        expect(()=>network.addPattern([1,2,3])).toThrow();
    });

     test('Letters pattern Dataset', function () {
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
