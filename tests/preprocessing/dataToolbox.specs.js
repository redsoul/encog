describe('DataToolbox', function () {
    const _ = require('lodash');
    let DataToolbox = require(PATHS.PREPROCESSING + 'dataToolbox');
    const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');

    describe('readTrainingCSV method', function () {
        describe('iris csv', function () {
            test('ignore and output columns', function (done) {
                DataToolbox.readTrainingCSV(
                    PATHS.DATA_FOLDER + 'iris.csv',
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

            test('input and output columns', function (done) {
                DataToolbox.readTrainingCSV(
                    PATHS.DATA_FOLDER + 'iris.csv',
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
            test('ignore and output columns', function (done) {
                DataToolbox.readTrainingCSV(
                    PATHS.DATA_FOLDER + 'customData.csv',
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
            test('load data without headers', function (done) {
                DataToolbox.readTrainingCSV(
                    PATHS.DATA_FOLDER + 'headlessCustomData.csv',
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

    describe('trainTestSplit', function () {
        test('should use the default test size', function () {
            const trainingSet = DataToolbox.trainTestSplit(_.range(100));

            expect(trainingSet.constructor.name).toBe('Object');
            expect(trainingSet.train.constructor.name).toBe('Array');
            expect(trainingSet.test.constructor.name).toBe('Array');

            expect(trainingSet.train.length).toBe(80);
            expect(trainingSet.test.length).toBe(20);
        });

        test('should use a given test size', function () {
            const trainingSet = DataToolbox.trainTestSplit(_.range(100), .25);

            expect(trainingSet.train.length).toBe(75);
            expect(trainingSet.test.length).toBe(25);
        });

        test('should throw an exception', function () {
            expect(()=> {
                DataToolbox.trainTestSplit(_.range(100), 5)
            }).toThrow(new NeuralNetworkError('Test size should be between 0 and 1'))
        });
    });

    describe('sliceOutput', function () {
        test('should slice an array', function () {
            expect(DataToolbox.sliceOutput([[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15]], 2))
                .toEqual({
                    input: [[1, 2, 3], [6, 7, 8], [11, 12, 13]],
                    output: [[4, 5], [9, 10], [14, 15]]
                });
        });
    });
});