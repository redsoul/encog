const ActivationFunction = require('../activationFunction');

/**
 * The Steepened Sigmoid is an activation function typically used with NEAT.
 *
 * Valid derivative calculated with the R package, so this does work with
 * non-NEAT networks too.
 *
 * It was developed by  Ken Stanley while at The University of Texas at Austin.
 * http://www.cs.ucf.edu/~kstanley/
 *
 * @constructor
 * @class ActivationSteepenedSigmoid
 */
class ActivationSteepenedSigmoid extends ActivationFunction {
    constructor() {
        super("ActivationSteepenedSigmoid");
    }

    /**
     * @inheritDoc
     */
    activationFunction(x, start, size) {
        let i;

        for (i = start; i < start + size; i += 1) {
            x[i] = 1.0 / (1.0 + Math.exp(-4.9 * x[i]));
        }
    }

    /**
     * @inheritDoc
     */
    derivativeFunction(b, a) {
        const s = Math.exp(-4.9 * a);
        return Math.pow(s * 4.9 / (1 + s), 2);
    }

    /**
     * @return {ActivationSteepenedSigmoid} The object cloned;
     */
    clone() {
        return new ActivationSteepenedSigmoid();
    }
}

module.exports = ActivationSteepenedSigmoid;