describe('DataSet', function () {
    const _ = require('lodash');
    let DataSet = require(PATHS.DATASET + 'dataset');
    const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');

    const dataset = new DataSet();

    beforeEach(function () {

    });

    it('readTrainingCSV', function (done) {
        dataset.readTrainingCSV(__dirname + '/iris.csv', ['Species'], ['Id']).then(function (trainingDataset) {
            expect(trainingDataset.constructor.name).toBe('Object');
            expect(trainingDataset.input.constructor.name).toBe('Array');
            expect(trainingDataset.output.constructor.name).toBe('Array');

            expect(trainingDataset.input.length).toBe(150);
            expect(trainingDataset.output.length).toBe(150);
            expect(_.keys(trainingDataset.input[0])).toEqual(['Sepal.Length', 'Sepal.Width', 'Petal.Length', 'Petal.Width']);
            expect(_.keys(trainingDataset.output[0])).toEqual(['Species']);
            done();
        });
    });

    describe('trainTestSpit', function () {
        it('should use the default test size', function () {
            const trainingSet = dataset.trainTestSpit(_.range(100));

            expect(trainingSet.constructor.name).toBe('Object');
            expect(trainingSet.train.constructor.name).toBe('Array');
            expect(trainingSet.test.constructor.name).toBe('Array');

            expect(trainingSet.train.length).toBe(80);
            expect(trainingSet.test.length).toBe(20);
        });

        it('should use a given test size', function () {
            const trainingSet = dataset.trainTestSpit(_.range(100), .25);

            expect(trainingSet.train.length).toBe(75);
            expect(trainingSet.test.length).toBe(25);
        });

        it('should throw an exception', function () {
            expect(()=> {
                dataset.trainTestSpit(_.range(100), 5)
            }).toThrow(new NeuralNetworkError('Test size should be between 0 and 1'))
        });
    });

    describe('__calcMinMaxValues', function () {
        it('should return an object with min and max values per column', function () {
            let mixMaxValues = dataset.__calcMinMaxValues([[2, -3], [5, 4], [-1, 2], [2, 4]]);

            expect(mixMaxValues).toEqual([{max: 5, min: -1}, {max: 4, min: -3}]);
        });
    });

    describe('__featureScalling', function () {
        it('should throw an exception', function () {
            expect(()=> {
                dataset.__featureScalling(5, 4, 3)
            }).toThrow(new NeuralNetworkError('Min should be smaller than Max'));
        });

        it('should throw an exception', function () {
            expect(()=> {
                dataset.__featureScalling(5, 2, 3, 1, 0)
            }).toThrow(new NeuralNetworkError('Min range should be smaller than Max range'));
        });

        it('should return a normalized value, using the default parameters', function () {
            expect(dataset.__featureScalling(0, 0, 100)).toBe(-1);
            expect(dataset.__featureScalling(50, 0, 100)).toBe(0);
            expect(dataset.__featureScalling(100, 0, 100)).toBe(1);
            expect(dataset.__featureScalling(25, 0, 100)).toBe(-0.5);
            expect(dataset.__featureScalling(75, 0, 100)).toBe(0.5);
            expect(dataset.__featureScalling(150, 0, 100)).toBe(2);
        });

        it('should return a normalized value, using a customized range', function () {
            expect(dataset.__featureScalling(0, 0, 100, 0, 5)).toBe(0);
            expect(dataset.__featureScalling(50, 0, 100, 0, 5)).toBe(2.5);
            expect(dataset.__featureScalling(100, 0, 100, 0, 5)).toBe(5);
            expect(dataset.__featureScalling(25, 0, 100, 0, 5)).toBe(1.25);
            expect(dataset.__featureScalling(75, 0, 100, 0, 5)).toBe(3.75);
            expect(dataset.__featureScalling(150, 0, 100, 0, 5)).toBe(7.5);
        });
    });

    describe('normalizeData', function () {
        let values;

        beforeEach(function () {
            values = [[2, -3], [6, 4], [-1, 2], [2, 7]];
        });

        it('should return a normalized array, using the default parameters', function () {
            dataset.normalizeData(values);

            expect(values).toEqual([[-0.14285714, -1], [1, 0.4], [-1, 0], [-0.14285714, 1]]);
        });

        it('should return a normalized array, using a customized range', function () {
            dataset.normalizeData(values, 0, 5);

            expect(values).toEqual([ [ 2.14285714, 0 ], [ 5, 3.5 ], [ 0, 2.5 ], [ 2.14285714, 5 ] ]);
        });
    });
});