const Propagation = require('../propagation');
const SmartMomentum = require(__STRATAGIES + 'smartMomentum');
const SmartLearningRate = require(__STRATAGIES + 'smartLearningRate');
const ArrayUtils = require(__UTILS + 'array');

/**
 * This class implements a backpropagation training algorithm for feed forward
 * neural networks. It is used in the same manner as any other training class
 * that implements the Train interface.
 *
 * Backpropagation is a common neural network training algorithm. It works by
 * analyzing the error of the output of the neural network. Each neuron in the
 * output layer's contribution, according to weight, to this error is
 * determined. These weights are then adjusted to minimize this error. This
 * process continues working its way backwards through the layers of the neural
 * network.
 *
 * This implementation of the backpropagation algorithm uses both momentum and a
 * learning rate. The learning rate specifies the degree to which the weight
 * matrixes will be modified through each iteration. The momentum specifies how
 * much the previous learning iteration affects the current. To use no momentum
 * at all specify zero.
 *
 * One primary problem with backpropagation is that the magnitude of the partial
 * derivative is often detrimental to the training of the neural network. The
 * other propagation methods of Manhatten and Resilient address this issue in
 * different ways. In general, it is suggested that you use the resilient
 * propagation technique for most Encog training tasks over back propagation.
 */

class BackPropagation extends Propagation {
    /**
     *
     * @param network {BasicNetwork}
     *            The network that is to be trained
     * @param input {Array}
     *            The training set
     * @param output {Array}
     *            The output
     * @param theLearnRate {number}
     *            The rate at which the weight matrix will be adjusted based on
     *            learning.
     * @param theMomentum {number}
     *            The influence that previous iteration's training deltas will
     *            have on the current iteration.
     */
    constructor(network, input, output, theLearnRate = 0.7, theMomentum = 0.9) {
        super(network, input, output);

        this.addStrategy(new SmartMomentum());
        this.addStrategy(new SmartLearningRate());

        this.momentum = theMomentum;
        this.learningRate = theLearnRate;
        this.lastDelta = ArrayUtils.newFloatArray(network.getFlat().weights.length);
    }

    /**
     * @inheritDoc
     */
    updateWeight(gradients, lastGradient, index, dropoutRate = 0) {
        if (dropoutRate > 0) {
            return 0;
        }

        const delta = (gradients[index] * this.learningRate) + (this.lastDelta[index] * this.momentum);
        this.lastDelta[index] = delta;
        return delta;
    }
}

module.exports = BackPropagation;