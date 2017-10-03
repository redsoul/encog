const _ = require('lodash');
const CustomBuckets = require(PATHS.DATA_MAPPERS + 'customBuckets');

class LinearBuckets extends CustomBuckets {

    constructor(bucketCount) {
        super([]);
        this.bucketCount = bucketCount;
    }

    /**
     * Put numbers into buckets that have equal-size ranges.
     *
     * @param {Number[]} data The data to bucket.
     * @return {Number[][]} An array of buckets of numbers.
     */
    _bucketNumbersLinearly(data) {
        let i = 0;
        const l = data.length;
        let inc;
        const buckets = new Array(this.bucketCount);
        const min = _.min(data);
        const max = _.max(data);

        inc = (max - min) / this.bucketCount;

        // Initialize buckets
        for (i = 0; i < this.bucketCount; i++) {
            buckets[i] = [];
        }

        // Put the numbers into buckets
        for (i = 0; i < l; i++) {
            // Buckets include the lower bound but not the higher bound, except the top bucket
            if (data[i] === max) {
                buckets[this.bucketCount - 1].push(data[i]);
            } else {
                buckets[((data[i] - min) / inc) | 0].push(data[i]);
            }
        }

        return buckets;
    }

    /**
     * @param values {Array}
     * @param columnName {String}
     * @returns {Object}
     */
    fit_transform(values, columnName) {
        this.buckets = this._bucketNumbersLinearly(values);
        _.each(this.buckets, (bucket) => {
            this.boundaries.push(_.last(bucket));
        });

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

module.exports = LinearBuckets;