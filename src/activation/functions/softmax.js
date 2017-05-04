const ActivationFunction = require('../activationFunction');

/**
 * The softmax activation function.
 * @constructor
 * @class ActivationSoftmax
 */
class ActivationSoftmax extends ActivationFunction {
    constructor() {
        super("ActivationSoftmax");
    }

    /**
     * @inheritDoc
     */
    activationFunction(x, start, size) {
        let i;
        let sum = 0;

        for (i = start; i < start + size; i++) {
            x[i] = Math.exp(x[i]);
            sum += x[i];
        }
        if (isNaN(sum) || sum < PATHS.CONSTANTS.DEFAULT_DOUBLE_EQUAL) {
            for (i = start; i < start + size; i++) {
                x[i] = 1.0 / size;
            }
        } else {
            for (i = start; i < start + size; i++) {
                x[i] = x[i] / sum;
            }
        }
    }

    /**
     * @inheritDoc
     */
    derivativeFunction(b, a) {
        return 1;
    }

    /**
     * @return {ActivationSoftmax} The object cloned;
     */
    clone() {
        return new ActivationSoftmax();
    }
}

module.exports = ActivationSoftmax;