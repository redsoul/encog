const Q = require('q');
const _ = require('lodash');
const fs = require('fs');
const csv = require('fast-csv');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');

class DataToolbox {

    constructor() {

    }

    /**
     * @param dataset {Array}
     * @param testSize {Number}
     */
    static trainTestSplit(dataset, testSize = 0.2) {
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
                    if (options.headers) {
                        input.push((inputColumns.length > 0) ?
                            _.pick(entry, inputColumns) :
                            _.omit(entry, outputColumns.concat(ignoreColumns)));

                        if (outputColumns.length > 0) {
                            output.push(_.pick(entry, outputColumns));
                        }
                    } else {
                        input.push(entry);
                    }
                });

                if (output.length > 0) {
                    deferred.resolve({input: input, output: output});
                } else {
                    deferred.resolve(input);
                }
            })
            .on('error', function (error) {
                EncogLog.error(error);
                deferred.reject(error);
            });

        fs.createReadStream(file, {encoding: 'utf-8'}).pipe(parser);

        return deferred.promise;
    }

    /**
     * @param data {Array} of Arrays
     * @param outputColumnsCount {Number} Number of output columns to remove at the end of the row
     * */
    static sliceOutput(data, outputColumnsCount = 1) {
        const length = data[0].length;
        const result = {input: [], output: []};
        let chunks;
        _.each(data, (row)=> {
            chunks = _.chunk(row, length - outputColumnsCount);
            result.input.push(chunks[0]);
            result.output.push(chunks[1]);
        });

        return result;
    }
}

module.exports = DataToolbox;