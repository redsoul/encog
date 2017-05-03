/**
 * Simulated annealing is a common training method. This class implements a
 * simulated annealing algorithm that can be used both for neural networks, as
 * well as more general cases. This class is abstract, so a more specialized
 * simulated annealing subclass will need to be created for each intended use.
 * This book demonstrates how to use the simulated annealing algorithm to train
 * feedforward neural networks, as well as find a solution to the traveling
 * salesman problem.
 *
 * The name and inspiration come from annealing in metallurgy, a technique
 * involving heating and controlled cooling of a material to increase the size
 * of its crystals and reduce their defects. The heat causes the atoms to become
 * unstuck from their initial positions (a local minimum of the internal energy)
 * and wander randomly through states of higher energy; the slow cooling gives
 * them more chances of finding configurations with lower internal energy than
 * the initial one.
 */
class SimulatedAnnealing {
    constructor() {
        /**
         * Should the score be minimized.
         */
        this.shouldMinimize = true;
    }

    /**
     * Called to perform one cycle of the annealing process.
     */
    iteration() {
        let bestArray;

        this.score = this.calculateScore();
        bestArray = this.getArrayCopy();

        this.temperature = this.startTemperature;

        for (let i = 0; i < this.cycles; i++) {
            let curScore;
            this.randomize();
            curScore = this.calculateScore();

            if (this.shouldMinimize) {
                if (curScore < this.score) {
                    bestArray = this.getArrayCopy();
                    this.score = curScore;
                }
            } else {
                if (curScore > this.score) {
                    bestArray = this.getArrayCopy();
                    this.score = curScore;
                }
            }

            this.putArray(bestArray);
            this.temperature *= Math.exp(Math.log(this.stopTemperature / this.startTemperature) / (this.cycles - 1));
        }
    }

    /**
     * Subclasses must provide access to an array that makes up the solution.
     *
     * @return An array that makes up the solution.
     */
    getArrayCopy() {

    }

    /**
     * Subclasses should provide a method that evaluates the score for the
     * current solution. Those solutions with a lower score are better.
     *
     * @return {Number} Return the score.
     */
    calculateScore() {

    }

    /**
     * Randomize the weight matrix.
     */
    randomize() {

    }

    /**
     * Store the array.
     *
     * @param array {Array}
     *            The array to be stored.
     */
    putArray(array) {
    }
}

module.exports = SimulatedAnnealing;