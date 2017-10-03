const _ = require('lodash');
const _dataMapper = require(PATHS.DATA_MAPPERS + '_dataMapper');

class CustomBuckets extends _dataMapper {

    constructor(boundaries) {
        super();
        this.boundaries = boundaries;
    }

    _findBoundary(value) {
        let index = -1;
        let lowBoundary = 0;
        let highBondary = _.head(this.boundaries);

        _.each(this.boundaries, (boundary, _index) => {
            if (value >= lowBoundary && value < highBondary) {
                index = _index;
                return false;
            }

            lowBoundary = boundary;
            highBondary = this.boundaries[_index + 1]
        });

        return (index >= 0) ? index : _.lastIndexOf(this.boundaries);
    }

    /**
     * @param values {Array}
     * @param columnName {String}
     * @returns {Object}
     */
    fit_transform(values, columnName) {
        return this.transform(values, columnName);
    }

    /**
     * @param values {Array}
     * @param columnName {String}
     * @returns {Object}
     */
    transform(values, columnName) {
        const result = [];

        _.each(values, (value, index) => {
            result[index] = this._findBoundary(value);
        });

        return {
            columns: [columnName],
            values: result
        };
    }
}

module.exports = CustomBuckets;