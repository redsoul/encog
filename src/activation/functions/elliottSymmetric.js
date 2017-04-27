var ActivationFunction = require('../activationFunction');

/**
 * Computationally efficient alternative to ActivationTANH.
 * Its output is in the range [-1, 1], and it is derivable.
 *
 * It will approach the -1 and 1 more slowly than Tanh so it
 * might be more suitable to classification tasks than predictions tasks.
 *
 * Elliott, D.L. "A better activation function for artificial neural networks", 1993
 * http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.46.7204&rep=rep1&type=pdf
 * @constructor
 * @class ActivationElliottSymmetric
 */

class ActivationElliottSymmetric extends ActivationFunction {

    constructor(slope) {
        super('ActivationElliottSymmetric');
        this.slope = slope || 1;
    }

    /**
     * @inheritDoc
     */
    activationFunction(x, start, size) {
        let i;
        for (i = start; i < start + size; i += 1) {
            x[i] = (x[i] * this.slope) / (1 + Math.abs(x[i] * this.slope));
        }
    }

    /**
     * @inheritDoc
     */
    derivativeFunction(b, a) {
        const d = (1.0 + Math.abs(b * this.slope));
        return this.slope / (d * d);
    }

    /**
     * @return {ActivationElliottSymmetric} The object cloned;
     */
    clone() {
        return new ActivationElliottSymmetric(this.slope);
    }
}

module.exports = ActivationElliottSymmetric;