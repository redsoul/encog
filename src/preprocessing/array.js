const _ = require('lodash');
module.exports = class ArrayUtils {
    /**
     * Fill an array with a specific value.
     * @method fillArray
     * @param arr The array to fill.
     * @param start The starting index.
     * @param stop The stopping index.
     * @param value The value to fill.
     */
    static fill(arr, start, stop, value) {
        if (arguments.length === 2) {
            _.fill(arguments[0], arguments[1]);
        } else {
            _.fill(arr, value, start, stop);
        }
    };

    /**
     * Create a new floating point array.
     * @param size {Number} The size of the array to create.
     * @param defaultValue {Number} The default value
     * @return {Array}
     */
    static newFloatArray(size, defaultValue = 0.0) {
        return _.fill(Array(size), defaultValue);
    };

    /**
     * Create a new int array.
     * @param size {Number} The size of the array to create.
     * @param defaultValue {Number} The default value
     * @return {Array}
     */
    static newIntArray(size, defaultValue = 0) {
        return _.fill(Array(size), defaultValue);
    };

    /**
     * Create a new boolean point array.
     * @param size {Number} The size of the array to create.
     * @return {Array}
     */
    static newBooleanArray(size) {
        return _.fill(Array(size), false);
    };

    /**
     * Copy an array
     *
     * @param source {Array}
     *            The source.
     * @param sourcePos {number}
     *            The source index.
     * @param target {Array}
     *            The target.
     * @param targetPos {number}
     *            The target index.
     * @param length {number}
     *            The length.
     */
    static arrayCopy(source, sourcePos, target, targetPos, length) {
        if (arguments.length == 2) {
            ArrayUtils.arrayCopy(arguments[0], 0, arguments[1], 0, arguments[0].length);
        } else if (sourcePos >= 0 && targetPos >= 0) {
            for (let index = 0; index < sourcePos + length; index++) {
                target[targetPos + index] = source[index];
            }
        }
    }

    /**
     * @param arr {Array}
     * @param rowSize {Number}
     */
    static toStringAsMatrix(arr, rowSize) {
        let str = "";
        _.map(arr, (v, index)=> {
            str += v;
            if ((index + 1) % rowSize == 0) {
                str += '\n'
            } else {
                str += ',';
            }
        });
        str = _.trim(str);
        str = _.trimEnd(str, ',');

        return str;
    }
}