class ActivationFunction {
    constructor(type) {
        this.type = type;
    }

    /**
     * Calculate the activation function for the specified value.
     * @method activationFunction
     * @param x An array to calculate the values for.
     * @param start The starting point in the array to calculate.
     * @param size The size to calculate.
     */
    activationFunction(x, start, size) {
    }

    /**
     * Calculate the derivative. For efficiency both the before and after
     * activation values are passed in.  Many activation derivatives can
     * be more efficiently calculated using the value after the regular
     * activation is calculated.
     * @param b The value before the regular activation was calculated.
     * @param a The value after the regular activation was calculated.
     * @return {Number} The result.
     */
    derivativeFunction(b, a) {
    }

    /**
     * @return {ActivationFunction} The object cloned;
     */
    clone() {
        return new ActivationFunction();
    }

    toJSON() {
        return this.type;
    }

    toString() {
        return this.type;
    }
}

module.exports = ActivationFunction;