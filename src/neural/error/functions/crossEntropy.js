var ErrorFunction = require('../errorFunction');

/**
 * Implements a cross entropy error function.  This can be used with backpropagation to
 * sometimes provide better performance than the standard linear error function.
 * @author jheaton
 *
 */
class CrossEntropyError extends ErrorFunction {
    /**
     * @inheritDoc
     */
    calculateError(activationFunction, before, after,
                   ideal, actual, error, derivShift,
                   significance) {
        for (let i = 0; i < actual.length; i++) {
            error[i] = (ideal[i] - actual[i]) * significance;
        }
    }
}

module.exports = CrossEntropyError;