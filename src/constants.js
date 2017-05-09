module.exports = {
    /**
     * The precision that Encog uses.
     * @property precision
     * @type String
     * @final
     */
    precision: 1e-10,
    roundPrecision: 8,

    /**
     * Default point at which two doubles are equal.
     */
    DEFAULT_DOUBLE_EQUAL: 0.0000000000001,
    ERROR_CALCULATION_MODES: {
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
    }
};