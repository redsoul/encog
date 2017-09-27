describe('DataToolbox', function () {
    const _ = require('lodash');
    let DataToolbox = require(PATHS.UTILS + 'dataToolbox');
    const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');

    beforeEach(function () {

    });

    describe('readTrainingCSV method', function () {
        describe('iris csv', function () {
            it('ignore and output columns', function (done) {
                DataToolbox.readTrainingCSV(
                    __dirname + '/../csv/iris.csv',
                    {
                        outputColumns: ['Species'],
                        ignoreColumns: ['Id']
                    }
                ).then(function (trainingDataset) {
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

            it('input and output columns', function (done) {
                DataToolbox.readTrainingCSV(
                    __dirname + '/../csv/iris.csv',
                    {
                        outputColumns: ['Species'],
                        inputColumns: ['Sepal.Width']
                    }
                ).then(function (trainingDataset) {
                    expect(trainingDataset.constructor.name).toBe('Object');
                    expect(trainingDataset.input.constructor.name).toBe('Array');
                    expect(trainingDataset.output.constructor.name).toBe('Array');

                    expect(trainingDataset.input.length).toBe(150);
                    expect(trainingDataset.output.length).toBe(150);
                    expect(_.keys(trainingDataset.input[0])).toEqual(['Sepal.Width']);
                    expect(_.keys(trainingDataset.output[0])).toEqual(['Species']);
                    done();
                });
            });
        });

        describe('custom data csv', function () {
            it('ignore and output columns', function (done) {
                DataToolbox.readTrainingCSV(
                    __dirname + '/../csv/customData.csv',
                    {
                        outputColumns: ['output1', 'output2'],
                        ignoreColumns: ['feature5']
                    }
                ).then(function (trainingDataset) {
                    expect(trainingDataset.constructor.name).toBe('Object');
                    expect(trainingDataset.input.constructor.name).toBe('Array');
                    expect(trainingDataset.output.constructor.name).toBe('Array');

                    expect(trainingDataset.input.length).toBe(4);
                    expect(trainingDataset.output.length).toBe(4);
                    expect(_.keys(trainingDataset.input[0])).toEqual(['feature1', 'feature2', 'feature3', 'feature4']);
                    expect(_.keys(trainingDataset.output[0])).toEqual(['output1', 'output2']);
                    done();
                });
            });
        });

        describe('headless custom data csv', function () {
            it('load data without headers', function (done) {
                DataToolbox.readTrainingCSV(
                    __dirname + '/../csv/headlessCustomData.csv',
                    {
                        headers: false
                    }
                ).then(function (trainingDataset) {
                    expect(trainingDataset.constructor.name).toBe('Array');
                    expect(trainingDataset.length).toBe(4);
                    expect(trainingDataset[0].length).toBe(7);
                    done();
                });
            });
        });
    });

    it('convertToArray', function () {
        const temp = DataToolbox.convertToArray([{a: 1, b: 2, c: 3}, {a: 4, b: 5, c: 6}]);
        expect(temp).toEqual([[1, 2, 3], [4, 5, 6]]);
    });

    describe('trainTestSplit', function () {
        it('should use the default test size', function () {
            const trainingSet = DataToolbox.trainTestSplit(_.range(100));

            expect(trainingSet.constructor.name).toBe('Object');
            expect(trainingSet.train.constructor.name).toBe('Array');
            expect(trainingSet.test.constructor.name).toBe('Array');

            expect(trainingSet.train.length).toBe(80);
            expect(trainingSet.test.length).toBe(20);
        });

        it('should use a given test size', function () {
            const trainingSet = DataToolbox.trainTestSplit(_.range(100), .25);

            expect(trainingSet.train.length).toBe(75);
            expect(trainingSet.test.length).toBe(25);
        });

        it('should throw an exception', function () {
            expect(()=> {
                DataToolbox.trainTestSplit(_.range(100), 5)
            }).toThrow(new NeuralNetworkError('Test size should be between 0 and 1'))
        });
    });

    describe('calcMinMaxValues', function () {
        it('should return an object with min and max values per column', function () {
            let mixMaxValues = DataToolbox.calcMinMaxValues([[2, -3], [5, 4], [-1, 2], [2, 4]]);

            expect(mixMaxValues).toEqual([{max: 5, min: -1}, {max: 4, min: -3}]);
        });
    });

    describe('featureScalling', function () {
        it('should throw an exception', function () {
            expect(()=> {
                DataToolbox.featureScaling(5, 4, 3)
            }).toThrow(new NeuralNetworkError('Min value should be smaller than Max value'));
        });

        it('should throw an exception', function () {
            expect(()=> {
                DataToolbox.featureScaling(5, 2, 3, 1, 0)
            }).toThrow(new NeuralNetworkError('Min range should be smaller than Max range'));
        });

        it('should return a normalized value, using the default parameters', function () {
            expect(DataToolbox.featureScaling(0, 0, 100)).toBe(-1);
            expect(DataToolbox.featureScaling(50, 0, 100)).toBe(0);
            expect(DataToolbox.featureScaling(100, 0, 100)).toBe(1);
            expect(DataToolbox.featureScaling(25, 0, 100)).toBe(-0.5);
            expect(DataToolbox.featureScaling(75, 0, 100)).toBe(0.5);
            expect(DataToolbox.featureScaling(150, 0, 100)).toBe(2);
        });

        it('should return a normalized value, using a customized range', function () {
            expect(DataToolbox.featureScaling(0, 0, 100, 0, 5)).toBe(0);
            expect(DataToolbox.featureScaling(50, 0, 100, 0, 5)).toBe(2.5);
            expect(DataToolbox.featureScaling(100, 0, 100, 0, 5)).toBe(5);
            expect(DataToolbox.featureScaling(25, 0, 100, 0, 5)).toBe(1.25);
            expect(DataToolbox.featureScaling(75, 0, 100, 0, 5)).toBe(3.75);
            expect(DataToolbox.featureScaling(150, 0, 100, 0, 5)).toBe(7.5);
        });
    });

    describe('normalizeData', function () {
        let values;

        beforeEach(function () {
            values = [[2, -3], [6, 4], [-1, 2], [2, 7]];
        });

        it('should return a normalized array, using the default parameters', function () {
            DataToolbox.normalizeData(values);

            expect(values).toEqual([[-0.14285714, -1], [1, 0.4], [-1, 0], [-0.14285714, 1]]);
        });

        it('should return a normalized array, using a customized range', function () {
            DataToolbox.normalizeData(values, 0, 5);

            expect(values).toEqual([[2.14285714, 0], [5, 3.5], [0, 2.5], [2.14285714, 5]]);
        });
    });

    describe('one hot encode/decode', function () {

        beforeEach(function () {
        });

        it('should encode into a one hot array', function () {
            expect(DataToolbox.oneHotEncode([1, 2])).toEqual({
                dictionary: [1, 2],
                oneHotData: [[1, 0], [0, 1]]
            });
            expect(DataToolbox.oneHotEncode([1, 2, 3])).toEqual({
                dictionary: [1, 2, 3],
                oneHotData: [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
            });
            expect(DataToolbox.oneHotEncode(['a', 'b', 'c', 'd'])).toEqual({
                dictionary: ['a', 'b', 'c', 'd'],
                oneHotData: [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]
            });
            expect(DataToolbox.oneHotEncode(['a', 'b', 'a', 'b', 'c', 'd'])).toEqual({
                dictionary: ['a', 'b', 'c', 'd'],
                oneHotData: [[1, 0, 0, 0], [0, 1, 0, 0], [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]
            });
        });

        it('should decode a one hot array', function () {
            expect(DataToolbox.oneHotDecode([1, 2], [1, 0])).toBe(1);
            expect(DataToolbox.oneHotDecode([1, 2], [0, 1])).toBe(2);
            expect(DataToolbox.oneHotDecode([1, 2, 3], [0, 0, 1])).toBe(3);
            expect(DataToolbox.oneHotDecode([1, 2, 3], [0, 1, 0])).toBe(2);
            expect(DataToolbox.oneHotDecode([1, 2, 3], [1, 0, 0])).toBe(1);
            expect(DataToolbox.oneHotDecode([1, 2, 3], [1, 1, 0])).toBe(1);
            expect(DataToolbox.oneHotDecode([1, 2, 3], [1, 1, 1])).toBe(1);
            expect(DataToolbox.oneHotDecode(['a', 'b', 'c', 'd'], [0, 1, 0, 0])).toBe('b');
        });
    });
});