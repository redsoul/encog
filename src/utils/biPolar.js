const ArrayUtils = require(PATHS.UTILS + 'array');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
/**
 * This class contains a number of utility methods used to work with bipolar
 * numbers. A bipolar number is another way to represent binary numbers. The
 * value of true is defined to be one, where as false is defined to be negative
 * one.
 */
class BiPolarUtil {

    /**
     * Convert a boolean array to a bipolar array.
     *
     * @param b {Array | Boolean} A an array of boolean values.
     * @return {Array | Number} An array of bipolar values.
     */
    static bipolar2double(b) {
        if (typeof b === 'undefined') {
            throw new NeuralNetworkError('bipolar2double undefined argument');
        }

        switch (b.constructor.name) {
            case 'Boolean':
                return b ? 1 : -1;
                break;
            case 'Array':
                let result = ArrayUtils.newBooleanArray(b.length);
                for (let i = 0; i < b.length; i++) {
                    result[i] = BiPolarUtil.bipolar2double(b[i]);
                }

                return result;
                break;
        }
    }

    /**
     * Convert a bipolar array to a binary array.
     *
     * @param b {Array | Number} A an array of boolean values.
     * @return {Array | Number} An array of bipolar values.
     */
    static bipolar2binary(b) {
        if (typeof b === 'undefined') {
            throw new NeuralNetworkError('bipolar2binary undefined argument');
        }

        switch (b.constructor.name) {
            case 'Number':
                return b === 1 ? 1 : 0;
                break;
            case 'Array':
                let result = ArrayUtils.newIntArray(b.length);
                for (let i = 0; i < b.length; i++) {
                    result[i] = BiPolarUtil.bipolar2binary(b[i]);
                }

                return result;
                break;
        }
    }

    /**
     * Convert a bipolar value to a boolean.
     *
     * @param d {Array | Boolean} A an array of boolean values.
     * @return {Array | Boolean} An array of bipolar values.
     */
    static double2bipolar(d) {
        switch (d.constructor.name) {
            case 'Number':
                return d > 0;
                break;
            case 'Array':
                let result = ArrayUtils.newBooleanArray(d.length);
                for (let i = 0; i < d.length; i++) {
                    result[i] = BiPolarUtil.double2bipolar(d[i]);
                }

                return result;
                break;
        }
    }


    /**
     * Normalize a binary number. If the number is not zero then make it 1, if
     * it is zero, leave it alone.
     *
     * @param d {Number} A number to normalize to binary.
     * @return {Number} A binary digit.
     */
    static normalizeBinary(d) {
        return d > 0 ? 1 : 0;
    }

    /**
     * Convert bipolar to binary.
     *
     * @param d {Number} A bipolar number.
     * @return {Number} A binary digit.
     */
    static toBinary(d) {
        return (d + 1) / 2.0;
    }

    /**
     * Convert binary to bipolar.
     *
     * @param d {Number} A binary number.
     * @return {Number} A bipolar number.
     */
    static toBiPolar(d) {
        return 2 * BiPolarUtil.normalizeBinary(d) - 1;
    }

    /**
     * Convert to binary and normalize.
     *
     * @param d {Number}  A number to convert to binary.
     * @return {Number} A normalized binary number.
     */
    static  toNormalizedBinary(d) {
        return BiPolarUtil.normalizeBinary(BiPolarUtil.toBinary(d));
    }
}

module.exports = BiPolarUtil;