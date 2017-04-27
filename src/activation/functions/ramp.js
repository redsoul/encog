var ActivationFunction = require('../activationFunction');

/**
 * A ramp activation function. This function has a high and low threshold. If
 * the high threshold is exceeded a fixed value is returned. Likewise, if the
 * low value is exceeded another fixed value is returned.
 * @constructor
 * @class ActivationRamp
 */

class ActivationRamp extends ActivationFunction {

    constructor(thresholdHigh = 1, thresholdLow = 0, high = 1, low = 0) {
        super("ActivationRamp");
        /**
         * The ramp high threshold parameter.
         */
        this.highThreshold = thresholdHigh;
        /**
         * The ramp low threshold parameter.
         */
        this.lowThreshold = thresholdLow;
        /**
         * The ramp high parameter.
         */
        this.high = high;
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
        const slope = (this.highThreshold - this.lowThreshold)
            / (this.high - this.low);

        for (i = start; i < start + size; i++) {
            if (x[i] < this.lowThreshold) {
                x[i] = this.low;
            } else if (x[i] > this.highThreshold) {
                x[i] = this.high;
            } else {
                x[i] = (slope * x[i]);
            }
        }
    }

    /**
     * @inheritDoc
     */
    derivativeFunction(b, a) {
        return 1.0;
    }

    /**
     * @return {ActivationRamp} The object cloned;
     */
    clone() {
        return new ActivationRamp(this.highThreshold, this.lowThreshold, this.high, this.low);
    }
}

module.exports = ActivationRamp;