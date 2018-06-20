const Propagation = require('../propagation');
const ArrayUtils = require(PATHS.PREPROCESSING + 'array');
const EncogMath = require(PATHS.MATH_UTILS + 'encogMath');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
const RPROPConst = require('../resilientConst');

const RPROPType = {
    /**
     * RPROP+ : The classic RPROP algorithm.  Uses weight back tracking.
     */
    RPROPp: 'RPROPp',

    /**
     * RPROP- : No weight back tracking.
     */
    RPROPm: 'RPROPm',

    /**
     * iRPROP+ : New weight back tracking method, some consider this to be the most advanced RPROP.
     */
    iRPROPp: 'iRPROPp',

    /**
     * iRPROP- : New RPROP without weight back tracking.
     */
    iRPROPm: 'iRPROPm',

    /**
     * ARPROP : Non-linear Jacobi RPROP.
     */
    ARPROP: 'ARPROP'
};
/**
 * One problem with the backpropagation algorithm is that the magnitude of the
 * partial derivative is usually too large or too small. Further, the learning
 * rate is a single value for the entire neural network. The resilient
 * propagation learning algorithm uses a special update value(similar to the
 * learning rate) for every neuron connection. Further these update values are
 * automatically determined, unlike the learning rate of the backpropagation
 * algorithm.
 *
 * For most training situations, we suggest that the resilient propagation
 * algorithm (this class) be used for training.
 *
 * There are a total of three parameters that must be provided to the resilient
 * training algorithm. Defaults are provided for each, and in nearly all cases,
 * these defaults are acceptable. This makes the resilient propagation algorithm
 * one of the easiest and most efficient training algorithms available.
 *
 * It is also important to note that RPROP does not work well with online training.
 * You should always use a batch size bigger than one.  Typically the larger the better.
 * By default a batch size of zero is used, zero means to include the entire training
 * set in the batch.
 *
 * The optional parameters are:
 *
 * zeroTolerance - How close to zero can a number be to be considered zero. The
 * default is 0.00000000000000001.
 *
 * initialUpdate - What are the initial update values for each matrix value. The
 * default is 0.1.
 *
 * maxStep - What is the largest amount that the update values can step. The
 * default is 50.
 *
 *
 * Usually you will not need to use these, and you should use the constructor
 * that does not require them.
 *
 *
 * @author jheaton
 *
 */
class ResilientPropagation extends Propagation {
    /**
     * Construct a resilient training object, allow the training parameters to
     * be specified. Usually the default parameters are acceptable for the
     * resilient training algorithm. Therefore you should usually use the other
     * constructor, that makes use of the default values.
     *
     * @param network
     *            The network to train.
     * @param input
     *            The input training set.
     * @param output
     *            The input training set.
     * @param initialUpdate
     *            The initial update values, this is the amount that the deltas
     *            are all initially set to.
     * @param maxStep
     *            The maximum that a delta can reach.
     */
    constructor(network, input, output, initialUpdate = RPROPConst.DEFAULT_INITIAL_UPDATE, maxStep = RPROPConst.DEFAULT_MAX_STEP) {
        super(network, input, output);

        this.updateValues = ArrayUtils.newFloatArray(this.currentFlatNetwork.weights.length, initialUpdate);
        this.lastDelta = ArrayUtils.newIntArray(this.currentFlatNetwork.weights.length);
        this.lastWeightChange = ArrayUtils.newFloatArray(this.currentFlatNetwork.weights.length);
        this.zeroTolerance = RPROPConst.DEFAULT_ZERO_TOLERANCE;
        this.maxStep = maxStep;
        this.rpropType = RPROPType.iRPROPp;

        /**
         * Denominator for ARPROP adaptive weight change
         */
        this.q = 1;

        /**
         * The value error at the beginning of the previous training iteration.
         * This value is compared with the error at the beginning of the current
         * iteration to determine if an improvement is occuring.
         */
        this.lastError = Number.POSITIVE_INFINITY;
        /**
         * Denominator for ARPROP adaptive weight change
         */
        this.q = 1;
    }

    /**
     * @returns {Object}
     */
    static getResilientTypes() {
        return RPROPType;
    }

    /**
     * @param rpropType {String}
     */
    setResilientType(rpropType = RPROPType.iRPROPp) {
        this.rpropType = rpropType;
    }

    /**
     * @inheritDoc
     */
    updateWeight(gradients, lastGradient, index, dropoutRate = 0) {
        if (dropoutRate > 0) {
            return 0;
        }

        let weightChange = 0;
        switch (this.rpropType) {
            case RPROPType.RPROPp:
                weightChange = this.updateWeightPlus(gradients, lastGradient, index);
                break;
            case RPROPType.RPROPm:
                weightChange = this.updateWeightMinus(gradients, lastGradient, index);
                break;
            case RPROPType.iRPROPp:
                weightChange = this.updateiWeightPlus(gradients, lastGradient, index);
                break;
            case RPROPType.iRPROPm:
                weightChange = this.updateiWeightMinus(gradients, lastGradient, index);
                break;
            case RPROPType.ARPROP:
                weightChange = this.updateJacobiWeight(gradients, lastGradient, index);
                break;
            default:
                throw new NeuralNetworkError("Unknown RPROP type: " + this.rpropType);
        }

        this.lastWeightChange[index] = weightChange;
        return weightChange;
    }

    /**
     * @param gradients {Array}
     * @param lastGradient {Array}
     * @param index {number}
     * @returns {number}
     */
    updateWeightPlus(gradients, lastGradient, index) {
        // multiply the current and previous gradient, and take the
        // sign. We want to see if the gradient has changed its sign.
        const change = EncogMath.sign(gradients[index] * lastGradient[index]);
        let weightChange = 0;
        let delta;

        // if the gradient has retained its sign, then we increase the
        // delta so that it will converge faster
        if (change > 0) {
            delta = this.updateValues[index] * RPROPConst.POSITIVE_ETA;
            delta = Math.min(delta, this.maxStep);
            weightChange = EncogMath.sign(gradients[index]) * delta;
            this.updateValues[index] = delta;
            lastGradient[index] = gradients[index];
        } else if (change < 0) {
            // if change<0, then the sign has changed, and the last delta was too big
            delta = this.updateValues[index] * RPROPConst.NEGATIVE_ETA;
            delta = Math.max(delta, RPROPConst.DELTA_MIN);
            this.updateValues[index] = delta;
            weightChange = this.lastWeightChange[index] * -1;
            // set the previous gradient to zero so that there will be no
            // adjustment the next iteration
            lastGradient[index] = 0;
        } else if (change == 0) {
            // if change==0 then there is no change to the delta
            delta = this.updateValues[index];
            weightChange = EncogMath.sign(gradients[index]) * delta;
            lastGradient[index] = gradients[index];
        }

        // apply the weight change, if any
        return weightChange;
    }

    /**
     * @param gradients {Array}
     * @param lastGradient {Array}
     * @param index {number}
     * @returns {number}
     */
    updateWeightMinus(gradients, lastGradient, index) {
        // multiply the current and previous gradient, and take the
        // sign. We want to see if the gradient has changed its sign.
        const change = EncogMath.sign(gradients[index] * lastGradient[index]);
        let weightChange;
        let delta;

        // if the gradient has retained its sign, then we increase the
        // delta so that it will converge faster
        if (change > 0) {
            delta = this.lastDelta[index] * RPROPConst.POSITIVE_ETA;
            delta = Math.min(delta, this.maxStep);
        } else {
            // if change<0, then the sign has changed, and the last
            // delta was too big
            delta = this.lastDelta[index] * RPROPConst.NEGATIVE_ETA;
            delta = Math.max(delta, RPROPConst.DELTA_MIN);
        }

        lastGradient[index] = gradients[index];
        weightChange = EncogMath.sign(gradients[index]) * delta;
        this.lastDelta[index] = delta;

        // apply the weight change, if any
        return weightChange;
    }

    /**
     * @param gradients {Array}
     * @param lastGradient {Array}
     * @param index {number}
     * @returns {number}
     */
    updateiWeightPlus(gradients, lastGradient, index) {
        // multiply the current and previous gradient, and take the
        // sign. We want to see if the gradient has changed its sign.
        const change = EncogMath.sign(gradients[index] * lastGradient[index]);
        let weightChange = 0;
        let delta;

        // if the gradient has retained its sign, then we increase the
        // delta so that it will converge faster
        if (change > 0) {
            delta = this.updateValues[index] * RPROPConst.POSITIVE_ETA;
            delta = Math.min(delta, this.maxStep);
            weightChange = EncogMath.sign(gradients[index]) * delta;
            this.updateValues[index] = delta;
            lastGradient[index] = gradients[index];
        } else if (change < 0) {
            // if change<0, then the sign has changed, and the last
            // delta was too big
            delta = this.updateValues[index] * RPROPConst.NEGATIVE_ETA;
            delta = Math.max(delta, RPROPConst.DELTA_MIN);
            this.updateValues[index] = delta;

            if (this.error > this.lastError) {
                weightChange = -this.lastWeightChange[index];
            }

            // set the previous gradent to zero so that there will be no
            // adjustment the next iteration
            lastGradient[index] = 0;
        } else if (change == 0) {
            // if change==0 then there is no change to the delta
            delta = this.updateValues[index];
            weightChange = EncogMath.sign(gradients[index]) * delta;
            lastGradient[index] = gradients[index];
        }

        // apply the weight change, if any
        return weightChange;
    }

    /**
     * @param gradients {Array}
     * @param lastGradient {Array}
     * @param index {number}
     * @returns {number}
     */
    updateiWeightMinus(gradients, lastGradient, index) {
        // multiply the current and previous gradient, and take the
        // sign. We want to see if the gradient has changed its sign.
        const change = EncogMath.sign(gradients[index] * lastGradient[index]);
        let weightChange;
        let delta;

        // if the gradient has retained its sign, then we increase the
        // delta so that it will converge faster
        if (change > 0) {
            delta = this.lastDelta[index] * RPROPConst.POSITIVE_ETA;
            delta = Math.min(delta, this.maxStep);
        } else {
            // if change<0, then the sign has changed, and the last
            // delta was too big
            delta = this.lastDelta[index] * RPROPConst.NEGATIVE_ETA;
            delta = Math.max(delta, RPROPConst.DELTA_MIN);
            lastGradient[index] = 0;
        }

        lastGradient[index] = gradients[index];
        weightChange = EncogMath.sign(gradients[index]) * delta;
        this.lastDelta[index] = delta;

        // apply the weight change, if any
        return weightChange;
    }

    /**
     * @param gradients {Array}
     * @param lastGradient {Array}
     * @param index {number}
     * @returns {number}
     */
    updateJacobiWeight(gradients, lastGradient, index) {
        // multiply the current and previous gradient, and take the
        // sign. We want to see if the gradient has changed its sign.
        const change = EncogMath.sign(gradients[index] * lastGradient[index]);
        let weightChange = 0;

        // if the gradient has retained its sign, then we increase the
        // delta so that it will converge faster
        let delta = this.updateValues[index];
        if (change > 0) {
            delta = this.updateValues[index] * RPROPConst.POSITIVE_ETA;
            delta = Math.min(delta, this.maxStep);
            weightChange = EncogMath.sign(gradients[index]) * delta;
            this.updateValues[index] = delta;
            lastGradient[index] = gradients[index];
        } else if (change < 0) {
            // if change<0, then the sign has changed, and the last
            // delta was too big
            delta = this.updateValues[index] * RPROPConst.NEGATIVE_ETA;
            delta = Math.max(delta, RPROPConst.DELTA_MIN);
            this.updateValues[index] = delta;
            weightChange = -this.lastWeightChange[index];
            // set the previous gradient to zero so that there will be no
            // adjustment the next iteration
            lastGradient[index] = 0;
        } else if (change == 0) {
            // if change==0 then there is no change to the delta
            delta = this.updateValues[index];
            weightChange = EncogMath.sign(gradients[index]) * delta;
            lastGradient[index] = gradients[index];
        }

        if (this.error > this.lastError) {
            weightChange = (1 / (2 * this.q)) * delta;
            this.q++;
        } else {
            this.q = 1;
        }

        // apply the weight change, if any
        return weightChange;
    }

    /**
     * {@inheritDoc}
     */
    postIteration() {
        super.postIteration();
        this.lastError = this.error;
    }
}

module.exports = ResilientPropagation;