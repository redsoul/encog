const Q = require('q');
const _ = require('lodash');
const fs = require('fs');
const csv = require('fast-csv');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
const CONSTANTS = PATHS.CONSTANTS;
const ArrayUtils = require(PATHS.UTILS + 'array');

class DataToolbox {

    constructor() {

    }

    /**
     * @param dataset {Array}
     * @param testSize {Number}
     */
    static trainTestSpit(dataset, testSize = 0.2) {
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
     * @param csvOptions {Object} - optional - full description on https://www.npmjs.com/package/fast-csv
     *
     * @returns {Promise}
     */
    static readTrainingCSV(file, csvOptions = {}) {
        let deferred = Q.defer();
        let dataset = [];
        let defaultCsvOptions = {
            outputColumns: [],
            inputColumns: [],
            ignoreColumns: [],
            headers: true,
            ignoreEmpty: false,
            discardUnmappedColumns: false,
            delimiter: ',',
            quote: '"',
            escape: '"',
            trim: false,
            rtrim: false,
            ltrim: false,
            comment: null
        };

        //merge with default options
        const _options = _.merge(defaultCsvOptions, csvOptions);
        const outputColumns = _options.outputColumns;
        const inputColumns = _options.inputColumns;
        const ignoreColumns = _options.ignoreColumns;
        const options = _.omit(_options, ['outputColumns', 'inputColumns', 'ignoreColumns']);

        //objectMode must be true
        options.objectMode = true;

        EncogLog.debug('Reading ' + file);
        const parser = csv(options)
            .on('data', function (data) {
                dataset.push(data);
            })
            .on('end', function (count) {
                const input = [];
                const output = [];
                EncogLog.debug(count + ' rows loaded');

                _.each(dataset, function (entry) {
                    input.push((inputColumns.length > 0) ? _.pick(entry, inputColumns) : _.omit(entry, outputColumns.concat(ignoreColumns)));
                    output.push(_.pick(entry, outputColumns));
                });

                deferred.resolve({input: input, output: output});
            })
            .on('error', function (error) {
                EncogLog.error(error);
                deferred.reject(error);
            });

        fs.createReadStream(file, {encoding: 'utf-8'}).pipe(parser);

        return deferred.promise;
    }

    /**
     * @param values {Array}
     * @returns {Array}
     */
    static calcMinMaxValues(values) {
        let minMaxValuesObj = [];

        //init max and min values
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
     * @param value {Number}
     * @param min {Number}
     * @param max {Number}
     * @param minRange {Number}
     * @param maxRange {Number}
     *
     * @returns {Number}
     */
    static featureScaling(value, min, max, minRange = -1, maxRange = 1) {
        if (min >= max) {
            throw new NeuralNetworkError('Min value should be smaller than Max value');
        }

        if (minRange >= maxRange) {
            throw new NeuralNetworkError('Min range should be smaller than Max range');
        }

        const normValue = minRange + (maxRange - minRange) * ((value - min) / (max - min));
        return _.round(normValue, CONSTANTS.roundPrecision);
    }

    /**
     * @param datasetObject {Array}
     * @returns {Array}
     */
    static convertToArray(datasetObject) {
        return _.map(datasetObject, function (row) {
            return _.values(row);
        });
    }

    /**
     * @param values {Array}
     * @param minRange {Number} Default -1
     * @param maxRange {Number} Default 1
     * */
    static normalizeData(values, minRange = -1, maxRange = 1) {
        let minMaxValues = DataToolbox.calcMinMaxValues(values);

        _.each(values, function (row, rowIndex) {
            // normalizedArr[rowIndex] = [];
            _.each(row, function (value, index) {
                if (isNaN(value)) {
                    value = 0;
                }

                values[rowIndex][index] = DataToolbox.featureScaling(
                    value,
                    minMaxValues[index].min,
                    minMaxValues[index].max,
                    minRange,
                    maxRange
                );
            });
        });
    }

    static oneHotDictionary(data) {
        return _.uniq(data);
    }

    /**
     * https://en.wikipedia.org/wiki/One-hot
     * @param data {Array}
     * @param customDictionary {Array}
     * @returns {Object}
     */
    static oneHotEncode(data, customDictionary) {
        const dictionary = customDictionary || this.oneHotDictionary(data);
        const oneHotLength = dictionary.length;
        const oneHotData = [];

        _.each(data, function (value) {
            const arr = ArrayUtils.newIntArray(oneHotLength);
            arr[dictionary.indexOf(value)] = 1;
            oneHotData.push(arr);
        });

        return {
            dictionary,
            oneHotData
        };
    }

    /**
     * https://en.wikipedia.org/wiki/One-hot
     * @param dictionary {Array}
     * @param oneHotArray {Array}
     * @returns {Object}
     */
    static oneHotDecode(dictionary, oneHotArray) {
        return dictionary[oneHotArray.indexOf(1)];
    }
}

module.exports = DataToolbox;