/**
 * An error function.  This is used to calculate the errors for the
 * output layer during propagation training.
 *
 */
class ErrorFunction {
    /**
     * Calculate the error.
     * @param activationFunction {ActivationFunction} The activation function used at the output layer.
     * @param before {Array}
     *            The number to calculate the derivative of, the number "before" the
     *            activation function was applied.
     * @param after {Array}
     *            The number "after" an activation function has been applied.
     * @param ideal {Array} The ideal values.
     * @param actual {Array} The actual values.
     * @param error {Array} The resulting error values.
     * @param derivShift {number} The amount to shift af derivativeFunction by
     * @param significance {number} Weighting to apply to ideal[i] - actual[i]
     */
    calculateError(activationFunction, before, after,
                   ideal, actual, error, derivShift,
                   significance = 1.0) {

    }
}

module.exports = ErrorFunction;