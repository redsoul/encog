var ErrorFunction = require('../errorFunction');

/**
 * An ATan based error function.  This is often used either with QuickProp
 * or alone.  This can improve the training time of a propagation
 * trained neural network.
 */
class AtanError extends ErrorFunction {
    /**
     * @inheritDoc
     */
    calculateError(activationFunction, before, after,
                   ideal, actual, error, derivShift,
                   significance) {
        for (let i = 0; i < actual.length; i++) {
            let deriv = af.derivativeFunction(before[i], after[i]);
            error[i] = (Math.atan(ideal[i] - actual[i]) * significance) * deriv;
        }
    }
}

module.exports = AtanError;