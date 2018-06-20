const ArrayUtils = require(PATHS.PREPROCESSING + 'array');
const _ = require('lodash');
const _dataMapper = require(PATHS.DATA_MAPPERS + '_dataMapper');

/**
 * https://en.wikipedia.org/wiki/One-hot
 */
class OneHot extends _dataMapper {

    constructor() {
        super();
    }

    /**
     * @param data {Array}
     * @param columnName {String}
     * @returns {Object}
     */
    fit_transform(data, columnName) {
        this.dictionary = _.uniq(data);
        return this.transform(data, columnName);
    }

    /**
     * @param data {Array}
     * @param columnName {String}
     * @returns {Object}
     */
    transform(data, columnName) {
        const oneHotLength = this.dictionary.length;
        const oneHotData = [];
        let arr;

        _.each(data, (value) => {
            arr = ArrayUtils.newIntArray(oneHotLength);
            arr[this.dictionary.indexOf(value)] = 1;
            oneHotData.push(arr);
        });

        return {
            columns: _.map(this.dictionary, function (value) {
                return columnName + '_' + value;
            }),
            values: oneHotData
        };
    }
}

module.exports = OneHot;