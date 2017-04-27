var ActivationFunction = require('../activationFunction');

/**
 * Computationally efficient alternative to ActivationSigmoid.
 * Its output is in the range [0, 1], and it is derivable.
 *
 * It will approach the 0 and 1 more slowly than Sigmoid so it
 * might be more suitable to classification tasks than predictions tasks.
 *
 * Elliott, D.L. "A better activation function for artificial neural networks", 1993
 * http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.46.7204&rep=rep1&type=pdf
 * @constructor
 * @class ActivationGaussian
 */

class ActivationGaussian extends ActivationFunction {

    constructor() {
        super("ActivationGaussian");
    }

    /**
     * @inheritDoc
     */
    activationFunction(x, start, size) {
        let i;

        for (i = start; i < start + size; i++) {
            x[i] = Math.exp(-Math.pow(2.5 * x[i], 2.0));
        }
    };

    /**
     * @inheritDoc
     */
    derivativeFunction(b, a) {
        return Math.exp(Math.pow(2.5 * b, 2.0) * 12.5 * b);
    }

    /**
     * @return {ActivationGaussian} The object cloned;
     */
    clone() {
        return new ActivationGaussian();
    }
}

module.exports = ActivationGaussian;