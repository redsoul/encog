const MathConst = {

    /**
     * Euler's number.
     */
    EULERS_NUMBER: 2.718281828,

    /**
     * Degrees in a semicircle.
     */
    DEG_SEMICIRCLE: 180.0,

    /**
     * Degrees in a circle.
     */
    DEG_CIRCLE: 360.0
};

/**
 * Several useful math functions for Encog.
 */
class EncogMath {

    /**
     * Convert degrees to radians.
     *
     * @param deg {number}
     *            Degrees.
     * @return {number} Radians.
     */
    static deg2rad(deg) {
        return deg * (Math.PI / MathConst.DEG_SEMICIRCLE);
    }

    /**
     * Determine if one double equals another, within the default percision.
     *
     * @param d1 {number}
     *            The first number.
     * @param d2 {number}
     *            The second number.
     * @return {boolean} True if the two doubles are equal.
     */
    static doubleEquals(d1, d2) {
        return Math.abs(d1 - d2) < CONSTANTS.DEFAULT_DOUBLE_EQUAL;
    }

    /**
     * sqrt(a^2 + b^2) without under/overflow.
     *
     * @param a {number}
     *            First param.
     * @param b {number}
     *            Second param.
     * @return {number} The result.
     */
    static hypot(a, b) {
        let r;
        if (Math.abs(a) > Math.abs(b)) {
            r = b / a;
            r = Math.abs(a) * Math.sqrt(1 + r * r);
        } else if (b != 0) {
            r = a / b;
            r = Math.abs(b) * Math.sqrt(1 + r * r);
        } else {
            r = 0.0;
        }
        return r;
    }

    /**
     * Get the index to the greatest number in a double array.
     *
     * @param array {Array}
     *            The array to search.
     * @return {number} The index of the greatest value, or -1 if empty.
     */
    static maxIndex(array) {
        let result = -1;

        for (let i = 0; i < array.length; i++) {
            if ((result == -1) || (array[result] < array[i])) {
                result = i;
            }
        }

        return result;
    }

    /**
     * Get the index to the smallest number in a double array.
     *
     * @param array {Array}
     *            The array to search.
     * @return {number} The index of the smallest value, or -1 if empty.
     */
    static minIndex(array) {
        let result = -1;

        for (let i = 0; i < array.length; i++) {
            if ((result == -1) || (array[result] > array[i])) {
                result = i;
            }
        }

        return result;
    }

    /**
     * Convert radians to degrees.
     *
     * @param rad {number}
     *            Radians
     * @return {number} Degrees.
     */
    static rad2deg(rad) {
        return rad * (MathConst.DEG_SEMICIRCLE / Math.PI);
    }

    /**
     * Calculate x!.
     *
     * @param x {number}
     *            The number to calculate for.
     * @return {number} The factorial of x.
     */
    static factorial(x) {
        let result = 1.0;

        for (let i = 1; i <= x; i++) {
            result *= i;
        }

        return result;
    }

    /**
     * @param d {number}
     * @return {number}
     */
    static square(d) {
        return d * d;
    }

    /**
     * Determine the sign of the value.
     *
     * @param value {number}
     *            The value to check.
     * @return {number} -1 if less than zero, 1 if greater, or 0 if zero.
     */
    static sign(value) {
        if (Math.abs(value) < __CONSTANTS.DEFAULT_DOUBLE_EQUAL) {
            return 0;
        } else if (value > 0) {
            return 1;
        } else {
            return -1;
        }
    }

    /**
     * Transform a number in the range (-1,1) to a tri-state value indicated by
     * -1, 0 or 1.
     *
     * @param {number} value The value to consider.
     * @return {number} -1 if the value is below 1/3, 1 if above 1/3, zero otherwise.
     */
    static thirds(value) {
        if (value < -(1.0 / 3.0))
            return -1;
        else if (value > (1.0 / 3.0))
            return 1;
        else
            return 0;
    }
}

module.exports = EncogMath;