var ErrorFunction = require('../errorFunction');

/**
 *
 */
class OutputError extends ErrorFunction {
    /**
     * @inheritDoc
     */
    calculateError(activationFunction, before, after,
                   ideal, actual, error, derivShift,
                   significance) {
        for (let i = 0; i < actual.length; i++) {
            let deriv = activationFunction.derivativeFunction(before[i], after[i]) + derivShift;
            error[i] = ((ideal[i] - actual[i]) * significance) * deriv;
        }
    }
}

module.exports = OutputError;