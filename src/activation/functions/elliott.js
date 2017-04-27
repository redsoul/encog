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
 * @class ActivationElliott
 */

class ActivationElliott extends ActivationFunction {

    constructor(slope) {
        super("ActivationElliott");
        this.slope = slope || 1;
    }


    /**
     * @inheritDoc
     */
    activationFunction(x, start, size) {
        let i;

        for (i = start; i < start + size; i += 1) {
            x[i] = ((x[i] * this.slope) / 2) / (1 + Math.abs(x[i] * this.slope)) + 0.5;
        }
    }

    /**
     * @inheritDoc
     */
    derivativeFunction(b, a) {
        return this.slope / (2.0 * (1.0 + Math.abs(b * this.slope)) * (1 + Math.abs(b * this.slope)));
    }

    /**
     * @return {ActivationElliott} The object cloned;
     */
    clone() {
        return new ActivationElliott(this.slope);
    }
}

module.exports = ActivationElliott;