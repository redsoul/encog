describe('BAM Pattern', function () {
    const Encog = require(PATHS.BASE);
    Encog.Log.options.logLevel = 'silent';
    
    const _ = require('lodash');
    let BamPattern;

    beforeEach(function () {
        BamPattern = new Encog.Patterns.Bam();
    });

     test('Should throw and error when trying to add more than one hidden layer', function () {
        expect(()=>BamPattern.addHiddenLayer(10)).toThrow()
    });

     test('Should throw and error when trying to set the input layer', function () {
        expect(()=>BamPattern.setInputLayer(10)).toThrow()
    });

     test('Should throw and error when trying to set the output layer', function () {
        expect(()=>BamPattern.setOutputLayer(10)).toThrow()
    });

     test('XOR Dataset', function () {
        const xorDataset = Encog.Utils.Datasets.getXORDataSet();

        BamPattern.setF1Neurons(2);
        BamPattern.setF2Neurons(1);
        const network = BamPattern.generate();

        _.each(xorDataset.input, function (dataset, index) {
            network.addPattern(dataset, xorDataset.output[index]);
        });

        expect(network.compute([0, 0])).toEqual([0]);
        expect(network.compute([1, 0])).toEqual([1]);
        expect(network.compute([0, 1])).toEqual([1]);
        // expect(network.compute([1, 1])).toEqual([0]);
    });
});
