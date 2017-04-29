const Propagation = require('../propagation');
/**
 * One problem that the backpropagation technique has is that the magnitude of
 * the partial derivative may be calculated too large or too small. The
 * Manhattan update algorithm attempts to solve this by using the partial
 * derivative to only indicate the sign of the update to the weight matrix. The
 * actual amount added or subtracted from the weight matrix is obtained from a
 * simple constant. This constant must be adjusted based on the type of neural
 * network being trained. In general, start with a higher constant and decrease
 * it as needed.
 *
 * The Manhattan update algorithm can be thought of as a simplified version of
 * the resilient algorithm. The resilient algorithm uses more complex techniques
 * to determine the update value.
 *
 * @author jheaton
 *
 */
class ManhattanPropagation extends Propagation{
    constructor(network, input, output, theLearnRate = 0.7){
        super(network, input, output);

        this.learningRate = theLearnRate;
        /**
         * The default tolerance to determine of a number is close to zero.
         */
        this.zeroTolerance = 0.001;
    }

    /**
     * @inheritDoc
     */
    updateWeight(gradients, lastGradient, index, dropoutRate = 0) {
        if (dropoutRate > 0) {
            return 0;
        }

        if (Math.abs(gradients[index]) < this.zeroTolerance) {
            return 0;
        } else if (gradients[index] > 0) {
            return this.learningRate;
        } else {
            return -this.learningRate;
        }
    }
}

module.exports = ManhattanPropagation;