const BasicTraining = require(PATHS.TRAINING + 'basic');
const ArrayUtils = require(PATHS.UTILS + 'array');
const HessionCR = require(PATHS.HESSIAN + 'hessianCR');
const ErrorCalculation = require(PATHS.ERROR_CALCULATION + 'errorCalculation');
const mathjs = require('mathjs');
const _ = require('lodash');
const Matrix = require(PATHS.MATRICES + 'matrix');
/**
 * The amount to scale the lambda by.
 */
const SCALE_LAMBDA = 10.0;
/**
 * The max amount for the LAMBDA.
 */
const LAMBDA_MAX = 1e25;

/**
 * Trains a neural network using a Levenberg Marquardt algorithm (LMA). This
 * training technique is based on the mathematical technique of the same name.
 *
 * The LMA interpolates between the Gauss-Newton algorithm (GNA) and the
 * method of gradient descent (similar to what is used by backpropagation.
 * The lambda parameter determines the degree to which GNA and Gradient
 * Descent are used.  A lower lambda results in heavier use of GNA,
 * whereas a higher lambda results in a heavier use of gradient descent.
 *
 * Each iteration starts with a low lambda that builds if the improvement
 * to the neural network is not desirable.  At some point the lambda is
 * high enough that the training method reverts totally to gradient descent.
 *
 * This allows the neural network to be trained effectively in cases where GNA
 * provides the optimal training time, but has the ability to fall back to the
 * more primitive gradient descent method
 *
 * LMA finds only a local minimum, not a global minimum.
 *
 * References:
 * http://www.heatonresearch.com/wiki/LMA
 * http://en.wikipedia.org/wiki/Levenberg%E2%80%93Marquardt_algorithm
 * http://en.wikipedia.org/wiki/Finite_difference_method
 * http://crsouza.blogspot.com/2009/11/neural-network-learning-by-levenberg_18.html
 * http://mathworld.wolfram.com/FiniteDifference.html
 * http://www-alg.ist.hokudai.ac.jp/~jan/alpha.pdf -
 * http://www.inference.phy.cam.ac.uk/mackay/Bayes_FAQ.html
 *
 */
class LevenbergMarquardtTraining extends BasicTraining {
    /**
     * Construct the LMA object.
     *
     * @param network
     *            The network to train.
     * @param input
     *            The input training set.
     * @param output
     *            The input training set.
     */
    constructor(network, input, output) {
        super();

        this.network = network;
        this.input = input;
        this.output = output;

        this.weightCount = this.network.structure.calculateSize();
        this.lambda = 0.1;
        this.deltas = ArrayUtils.newFloatArray(this.weightCount);
        this.diagonal = ArrayUtils.newFloatArray(this.weightCount);
        this.hessian = new HessionCR();
    }

    _saveDiagonal() {
        const h = this.hessian.hessianMatrix;
        for (let i = 0; i < this.weightCount; i++) {
            this.diagonal[i] = h.get(i, i);
        }
    }

    /**
     * @return {Number} The SSE error with the current weights.
     */
    _calculateError() {
        const result = new ErrorCalculation();

        for (let i = 0; i < this.input.length; i++) {
            const actual = this.network.compute(this.input[i]);
            result.updateError(actual, this.output[i]);
        }

        return result.calculateESS();
    }

    _applyLambda() {
        let h = this.hessian.hessianMatrix;
        for (let i = 0; i < this.weightCount; i++) {
            h.set(i, i, this.diagonal[i] + this.lambda);
        }
    }

    /**
     * Perform one iteration.
     */
    iteration() {
        this.hessian.init(this.network, this.input, this.output);

        this.preIteration();

        this.hessian.clear();
        this.weights = this.network.getFlat().encodeNetwork();

        this.hessian.compute();
        let currentError = this.hessian.sse;
        this._saveDiagonal();

        const startingError = currentError;
        let done = false;
        let singular;

        while (!done) {
            this._applyLambda();
            let lup = mathjs.lup(this.hessian.hessianMatrix.getData());
            let uMatrix = new Matrix(lup.U);

            singular = uMatrix.isNonSingular();

            if (singular) {
                this.deltas = mathjs.lusolve(lup, this.hessian.gradients)._data;
                this.updateWeights();
                currentError = this._calculateError();
            }

            if (!singular || currentError >= startingError) {
                this.lambda *= SCALE_LAMBDA;
                if (this.lambda > LAMBDA_MAX) {
                    this.lambda = LAMBDA_MAX;
                    done = true;
                }
            } else {
                this.lambda /= SCALE_LAMBDA;
                done = true;
            }
        }

        this.error = currentError;

        this.postIteration();
    }

    /**
     * Update the weights in the neural network.
     */
    updateWeights() {
        const w = _.clone(this.weights);

        for (let i = 0; i < w.length; i++) {
            w[i] += this.deltas[i];
        }

        this.network.getFlat().decodeNetwork(w);
    }
}

module.exports = LevenbergMarquardtTraining;