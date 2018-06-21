const _ = require('lodash');
const _dataMapper = require(PATHS.DATA_MAPPERS + '_dataMapper');

class IntegerParser extends _dataMapper {

    constructor() {
        super();
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
        let integerArr = [];

        _.each(values, (value, index) => {
            if (isNaN(value)) {
                value = 0;
            }

            integerArr[index] = _.parseInt(value);
        });

        return {columns: [columnName], values: integerArr};
    }
}

module.exports = IntegerParser;