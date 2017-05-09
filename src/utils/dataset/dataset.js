const Q = require('q');
const _ = require('lodash');
const fs = require('fs');
const csv = require('fast-csv');
const DataCollection = require('data-collection');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');

const CONSTANTS = PATHS.CONSTANTS;

class DataSet {
    constructor() {
    }

    /**
     * @param dataset {Array}
     * @param testSize {Number}
     */
    trainTestSpit(dataset, testSize = 0.2) {
        if (testSize >= 1 || testSize <= 0) {
            throw new NeuralNetworkError('Test size should be between 0 and 1');
        }

        //split the dataset in train and test dataset
        return {
            train: dataset.slice(0, dataset.length * (1 - testSize)),
            test: dataset.slice(-dataset.length * testSize)
        };
    }

    /**
     * @param file {String}
     * @param outputColumns {Array} - optional
     * @param ignoreColumns {Array} - optional
     * @returns {Promise}
     */
    readTrainingCSV(file, outputColumns = [], ignoreColumns = []) {
        let deferred = Q.defer();
        let dataset = [];
        var stream = fs.createReadStream(file);

        csv.fromStream(stream, {headers: true})
            .on('data', function (data) {
                dataset.push(data);
            })
            .on('end', function (count) {
                EncogLog.debug(count + ' rows loaded');

                dataset = _.map(dataset, function (entry) {
                    return _.omit(entry, ignoreColumns);
                });

                const input = _.map(dataset, function (entry) {
                    return _.omit(entry, outputColumns);
                });
                const output = _.map(dataset, function (entry) {
                    return _.pick(entry, outputColumns);
                });

                deferred.resolve({input: input, output: output});
            })
            .on('error', function (error) {
                EncogLog.error(error);
                deferred.reject(error);
            });

        return deferred.promise;
    }

    __calcMinMaxValues(values) {
        let minMaxValuesObj = [];

        //init max values object with -1
        _.each(values[0], function (values, index) {
            minMaxValuesObj[index] = {max: Number.NEGATIVE_INFINITY, min: Number.POSITIVE_INFINITY};
        });

        let chunks = _.chunk(values, 10000);
        _.each(chunks, function (chunkData) {
            _.each(chunkData, function (dataRow) {
                _.each(dataRow, function (value, index) {
                    minMaxValuesObj[index].max = Math.max(minMaxValuesObj[index].max, value);
                    minMaxValuesObj[index].min = Math.min(minMaxValuesObj[index].min, value);
                });
            });
        });

        return minMaxValuesObj;
    }

    /**
     * https://en.wikipedia.org/wiki/Feature_scaling
     *
     * */
    __featureScalling(value, min, max, minRange = -1, maxRange = 1) {
        if (min >= max) {
            throw new NeuralNetworkError('Min should be smaller than Max');
        }

        if (minRange >= maxRange) {
            throw new NeuralNetworkError('Min range should be smaller than Max range');
        }

        const normValue = minRange + (maxRange - minRange) * ((value - min) / (max - min));
        return _.round(normValue, CONSTANTS.roundPrecision);
    }


    /**
     * @param values {Array}
     * @param minRange {Number} Default -1
     * @param maxRange {Number} Default 1
     * */
    normalizeData(values, minRange = -1, maxRange = 1) {
        let normalizedArr = [];
        let minMaxValues = this.__calcMinMaxValues(values);
        const that = this;

        _.each(values, function (row, rowIndex) {
            // normalizedArr[rowIndex] = [];
            _.each(row, function (value, index) {
                if (isNaN(value)) {
                    value = 0;
                }

                values[rowIndex][index] = that.__featureScalling(
                    value,
                    minMaxValues[index].min,
                    minMaxValues[index].max,
                    minRange,
                    maxRange
                );
            });
        });

        return normalizedArr;
    }
}

module.exports = DataSet;