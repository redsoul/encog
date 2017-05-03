/**
 * Used by simulated annealing and genetic algorithms to calculate the score
 * for a machine learning method.  This allows networks to be ranked.  We may be seeking
 * a high or a low score, depending on the value the shouldMinimize
 * method returns.
 */
class CalculateScore {
    /**
     * Calculate this network's score.
     * @param method The ML method.
     * @return {Number} The score.
     */
    calculateScore(method) {

    }

    /**
     * @return {boolean} True if the goal is to minimize the score.
     */
    shouldMinimize() {

    }
}

module.exports = CalculateScore;