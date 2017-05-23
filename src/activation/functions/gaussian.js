var ActivationFunction = require('../activationFunction');

/**
 * An activation function based on the Gaussian function. The output range is
 * between 0 and 1. This activation function is used mainly for the HyperNeat
 * implementation.
 *
 * A derivative is provided, so this activation function can be used with
 * propagation training.  However, its primary intended purpose is for
 * HyperNeat.  The derivative was obtained with the R statistical package.
 *
 * If you are looking to implement a RBF-based neural network, see the
 * RBFNetwork class.
 *
 * The idea for this activation function was developed by  Ken Stanley, of
 * the University of Texas at Austin.
 * http://www.cs.ucf.edu/~kstanley/
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