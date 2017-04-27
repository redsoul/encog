var ActivationFunction = require('../activationFunction');

/**
 * The sigmoid activation function takes on a sigmoidal shape. Only positive
 * numbers are generated. Do not use this activation function if negative number
 * output is desired.
 * @constructor
 * @class ActivationSigmoid
 */
class ActivationSigmoid extends ActivationFunction{
    constructor() {
        super("ActivationSigmoid");
    }

    /**
     * @inheritDoc
     */
    activationFunction (x, start, size) {
        let i;

        for (i = start; i < start + size; i += 1) {
            x[i] = 1.0 / (1.0 + Math.exp(-1 * x[i]));
        }
    }

    /**
     * @inheritDoc
     */
    derivativeFunction(b, a) {
        return a * (1.0 - a);
    }

    /**
     * @return {ActivationSigmoid} The object cloned;
     */
    clone() {
        return new ActivationSigmoid();
    }
}

module.exports = ActivationSigmoid;