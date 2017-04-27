var ActivationFunction = require('../activationFunction');

/**
 * The Linear layer is really not an activation function at all. The input is
 * simply passed on, unmodified, to the output. This activation function is
 * primarily theoretical and of little actual use. Usually an activation
 * function that scales between 0 and 1 or -1 and 1 should be used.
 * @constructor
 * @class ActivationLinear
 */
class ActivationLinear extends ActivationFunction {

    constructor() {
        super("ActivationLinear");
    }

    /**
     * @inheritDoc
     */
    derivativeFunction() {
        return 1.0;
    }

    /**
     * @return {ActivationLinear} The object cloned;
     */
    clone() {
        return new ActivationLinear();
    }
}

module.exports = ActivationLinear;