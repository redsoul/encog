var ActivationFunction = require('../activationFunction');

/**
 * A ramp activation function. This function has a high and low threshold. If
 * the high threshold is exceeded a fixed value is returned. Likewise, if the
 * low value is exceeded another fixed value is returned.
 * @constructor
 * @class ActivationReLU
 */

class ActivationReLU extends ActivationFunction {

    constructor(thresholdLow = 0, low = 0) {
        super("ActivationReLU");

        /**
         * The ramp low threshold parameter.
         */
        this.lowThreshold = thresholdLow;
        /**
         * The ramp low parameter.
         */
        this.low = low;
    }

    /**
     * @inheritDoc
     */
    activationFunction(x, start, size) {
        let i;

        for (i = start; i < start + size; i++) {
            if (x[i] <= this.lowThreshold) {
                x[i] = this.low;
            }
        }
    }

    /**
     * @inheritDoc
     */
    derivativeFunction(b, a) {
        if (b <= this.lowThreshold) {
            return 0;
        }
        return 1.0;
    }

    /**
     * @return {ActivationReLU} The object cloned;
     */
    clone() {
        return new ActivationReLU(this.lowThreshold, this.low);
    }
}

module.exports = ActivationReLU;