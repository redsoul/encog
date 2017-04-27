var ErrorFunction = require('../errorFunction');

/**
 * The standard linear error function, simply returns the difference
 * between the actual and ideal.
 */
class LinearError extends ErrorFunction {
    /**
     * @inheritDoc
     */
    calculateError(activationFunction, before, after,
                   ideal, actual, error, derivShift,
                   significance = 1.0) {
        let deriv;
        for (let i = 0; i < actual.length; i++) {
            deriv = activationFunction.derivativeFunction(before[i], after[i]);
            error[i] = ((ideal[i] - actual[i]) * significance) * deriv;
        }
    }
}

module.exports = LinearError;