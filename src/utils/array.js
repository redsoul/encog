const _ = require('lodash');
class ArrayUtils {
    /**
     * Fill an array with a specific value.
     * @method fillArray
     * @param arr The array to fill.
     * @param start The starting index.
     * @param stop The stopping index.
     * @param value The value to fill.
     */
    static fillArray(arr, start, stop, value) {
        if (arguments.length == 2) {
            _.fill(arguments[0], arguments[1]);
        } else {
            _.fill(arr, value, start, stop);
        }
    };

    static __allocateArray(sz, defaultValue){
        let result = [];
        while (sz > 0) {
            result.push(defaultValue);
            sz -= 1;
        }
        return result;
    }

    /**
     * Create a new floating point array.
     * @param sz {number} The size of the array to create.
     * @return {Array}
     */
    static newFloatArray(sz, defaultValue = 0.0) {
        return ArrayUtils.__allocateArray(sz, defaultValue);
    };

    /**
     * Create a new int array.
     * @param sz {number} The size of the array to create.
     * @return {Array}
     */
    static newIntArray(sz, defaultValue = 0) {
        return ArrayUtils.__allocateArray(sz, defaultValue);
    };

    /**
     * Allocate an array of zeros of the specified size.
     * @param x The size of the array.
     */
    static allocate1D(x) {
        return _.fill(new Array(x), 0);
    };

    /**
     * Copy an array of doubles.
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
        } else {
            for (let index = 0; index < sourcePos + length; index++) {
                target[targetPos + index] = source[index];
            }
        }
    }

    /**
     * @param source {Array}
     * @return {Array}
     * */
    static arrayClone(source) {
        return _.clone(source);
    }
}

module.exports = ArrayUtils;