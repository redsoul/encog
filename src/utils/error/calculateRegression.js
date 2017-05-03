const ErrorCalculation = require(__ERROR_CALCULATION + 'errorCalculation');

class CalculateRegressionError {
    /**
     * @param method {BasicNetwork}
     * @param input {Array}
     * @param output {Array}
     * @returns {number}
     * */
    static calculateError(method, input, output) {
        let errorCalculation = new ErrorCalculation();

        // clear context
        method.clearContext();

        // calculate error
        for (let i = 0; i < input.length; i++) {
            const actual = method.compute(input[i]);
            errorCalculation.updateError(actual, output[i]);
        }

        return errorCalculation.calculate();
    }
}

module.exports = CalculateRegressionError;