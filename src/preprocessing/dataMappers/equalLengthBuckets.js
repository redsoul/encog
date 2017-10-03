const _ = require('lodash');
const CustomBuckets = require(PATHS.DATA_MAPPERS + 'customBuckets');

class EqualLengthBuckets extends CustomBuckets {

    constructor(bucketCount) {
        super([]);
        this.bucketCount = bucketCount;
    }

    /**
     * @param values {Array}
     * @param columnName {String}
     * @returns {Object}
     */
    fit_transform(values, columnName) {
        const uniqueValues = _.uniq(values);
        this.boundaries = _.map(_.chunk(uniqueValues, this.bucketCount), (value) => value[1]);
        return this.transform(values, columnName);
    }

    /**
     * @param values {Array}
     * @param columnName {String}
     * @returns {Object}
     */
    transform(values, columnName) {
        return super.transform(values, columnName);
    }
}

module.exports = EqualLengthBuckets;