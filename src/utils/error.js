const ErrorCalculation = require(PATHS.ERROR_CALCULATION + 'errorCalculation');

class ErrorUtils {
    /**
     * @param network {BasicNetwork | FreeformNetwork}
     * @param input {Array}
     * @param output {Array}
     * @returns {Number}
     */
    static calculateRegressionError(network, input, output) {
        const errorCalculation = new ErrorCalculation();
//     if( method instanceof MLContext )
// ((MLContext)method).clearContext();
        let actual;

        for (let i = 0; i < input.length; i++) {
            actual = network.compute(input[i]);
            errorCalculation.updateError(actual, output[i], 1);
        }
        return errorCalculation.calculate();
    }
}

module.exports = ErrorUtils;