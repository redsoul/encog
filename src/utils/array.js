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

    /**
     * Create a new floating point array.
     * @param sz {number} The size of the array to create.
     * @return {Array}
     */
    static newFloatArray(sz) {
        let result = [];
        while (sz > 0) {
            result.push(0.0);
            sz -= 1;
        }
        return result;
    };

    /**
     * Create a new int array.
     * @param sz {number} The size of the array to create.
     * @return {Array}
     */
    static newIntArray(sz) {
        let result = [];
        while ((sz -= 1) > 0) {
            result.push(0);
        }
        return result;
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
}

module.exports = ArrayUtils;