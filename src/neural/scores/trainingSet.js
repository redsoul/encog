const CalculateScore = require(PATHS.SCORE + 'calculate');
const CalculateRegressionError = require(PATHS.ERROR_CALCULATION + 'calculateRegression');

/**
 * Calculate a score based on a training set. This class allows simulated
 * annealing or genetic algorithms just as you would any other training set
 * based training method.  The method must support regression (MLRegression).
 */
class TrainingSetScore extends CalculateScore {
    /**
     * Construct a training set score calculation.
     *
     * @param input {Array}
     * @param output {Array}
     */
    constructor(input, output) {
        super();
        this.input = input;
        this.output = output;
    }

    /**
     * Calculate the score for the network.
     *
     * @param method {BasicNetwork} The network to calculate for.
     * @return {Number} The score.
     */
    calculateScore(method) {
        return CalculateRegressionError.calculateError(method, this.input, this.output);
    }

    /**
     * A training set based score should always seek to lower the error,
     * as a result, this method always returns true.
     * @return {Boolean} Returns true.
     */
    shouldMinimize() {
        return true;
    }
}

module.exports = TrainingSetScore;