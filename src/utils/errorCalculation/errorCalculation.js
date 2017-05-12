const ERROR_CALCULATION_MODES = {
    /**
     * Root mean square error.
     */
    RMS: 'RMS',

        /**
         * Mean square error.
         */
        MSE: 'MSE',

        /**
         * Sum of Squares error.
         */
        ESS: 'ESS',
        /**
         * Log loss (one-hot encoding/one-of-n encoding) Use for neural networks.
         */
        HOT_LOGLOSS: 'HOT_LOGLOSS',
        /**
         * Log loss (one-hot encoding/one-of-n encoding) Use for models other than neural networks.
         */
        LOGLOSS: 'LOGLOSS',
        NRMSE_MEAN: 'NRMSE_MEAN',
        NRMSE_RANGE: 'NRMSE_RANGE'
};

/**
 * Calculate the error of a neural network. Encog currently supports three error
 * calculation modes. See ErrorCalculationMode for more info.
 */
class ErrorCalculation {
    constructor() {
        this.mode = ERROR_CALCULATION_MODES.MSE;

        this.reset();
    }

    /**
     * Reset the error accumulation to zero.
     */
    reset() {
        /**
         * The overall error.
         */
        this.globalError = 0;
        /**
         * The size of a set.
         */
        this.setSize = 0;

        this.sum = 0;
    }

    /**
     * Called to update for each number that should be checked.
     *
     * @param actual {Array}
     *            The actual number.
     * @param ideal {Array}
     *            The ideal number.
     * @param significance {number}
     *            The signficance.
     */
    updateError(actual, ideal, significance = 1.0) {
        let delta;
        for (let j = 0; j < ideal.length; j += 1) {
            delta = (ideal[j] - actual[j]) * significance;

            this.sum += ideal[j];

            if (this.setSize == 0) {
                this.min = this.max = actual[j];
            } else {
                this.min = Math.min(actual[j], this.min);
                this.max = Math.max(actual[j], this.max);
            }
            this.globalError += delta * delta;
        }

        this.setSize += ideal.length;
    }

    /**
     * Returns the root mean square error for a complete training set.
     *
     * @return {number} The current error for the neural network.
     */
    calculate() {
        if (this.setSize == 0) {
            return 0;
        }

        switch (this.mode) {
            case ERROR_CALCULATION_MODES.RMS:
                return this.calculateRMS();
            case ERROR_CALCULATION_MODES.MSE:
                return this.calculateMSE();
            case ERROR_CALCULATION_MODES.ESS:
                return this.calculateESS();
            // case ERROR_CALCULATION_MODES.LOGLOSS:
            // case ERROR_CALCULATION_MODES.HOT_LOGLOSS:
            //     return this.calculateLogLoss();
            // case ERROR_CALCULATION_MODES.NRMSE_MEAN:
            //     return this.calculateMeanNRMSE();
            // case ERROR_CALCULATION_MODES.NRMSE_RANGE:
            //     return this.calculateRangeNRMSE();

            default:
                return this.calculateMSE();
        }
    }

    /**
     * Calculate the error with MSE.
     *
     * @return {number} The current error for the neural network.
     */
    calculateMSE() {
        if (this.setSize == 0) {
            return 0;
        }
        return this.globalError / this.setSize;
    }

    /**
     * Calculate the error with SSE.
     *
     * @return {number} The current error for the neural network.
     */
    calculateESS() {
        if (this.setSize == 0) {
            return 0;
        }
        return this.globalError / 2;
    }

    // calculateMeanNRMSE() {
    //     return this.calculateRMS() / (this.sum / this.setSize);
    // }
    //
    // calculateRangeNRMSE() {
    //     return this.calculateRMS() / (this.max - this.min);
    // }

    /**
     * Calculate the error with RMS.
     *
     * @return {number} The current error for the neural network.
     */
    calculateRMS() {
        if (this.setSize == 0) {
            return 0;
        }
        return Math.sqrt(this.globalError / this.setSize);
    }

    // calculateLogLoss() {
    //     return this.globalError * (-1.0 / this.setSize);
    // }
}

module.exports = ErrorCalculation;