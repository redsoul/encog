var ActivationFunction = require('../activationFunction');

/**
 * The hyperbolic tangent activation function takes the curved shape of the
 * hyperbolic tangent. This activation function produces both positive and
 * negative output. Use this activation function if both negative and positive
 * output is desired.
 * @constructor
 * @class ActivationTANH
 */

class ActivationTANH extends ActivationFunction {
    constructor() {
        super("ActivationTANH");
    }

    /**
     * @inheritDoc
     */
    activationFunction(x, start, size) {
        let i;

        for (i = start; i < start + size; i += 1) {
            x[i] = Math.tanh(x[i]);
        }
    }

    /**
     * @inheritDoc
     */
    derivativeFunction(b, a) {
        return (1.0 - a * a);
    }

    /**
     * @return {ActivationTANH} The object cloned;
     */
    clone() {
        return new ActivationTANH();
    }
}

module.exports = ActivationTANH;