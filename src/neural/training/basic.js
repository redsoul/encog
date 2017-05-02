/**
 * An abstract class that implements basic training for most training
 * algorithms. Specifically training strategies can be added to enhance the
 * training.
 *
 * @author jheaton
 *
 */
class BasicTraining {
    constructor() {
        this.strategies = [];
    }

    /**
     * Training strategies can be added to improve the training results. There
     * are a number to choose from, and several can be used at once.
     *
     * @param {Strategy} strategy
     *            The strategy to add.
     */
    addStrategy(strategy) {
        strategy.init(this);
        this.strategies.push(strategy);
    }

    /**
     * Should be called after training has completed and the iteration method
     * will not be called any further.
     */
    finishTraining() {
    }

    /**
     * @return {boolean} if training can progress no further.
     */
    // isTrainingDone() {
    //     for (let strategy of this.strategies) {
    //         if (strategy.constructor.name == 'EndTrainingStrategy') {
    //             if (strategy.shouldStop()) {
    //                 return true;
    //             }
    //         }
    //     }
    //
    //     return false;
    // }

    /**
     * Call the strategies after an iteration.
     */
    postIteration() {
        for (let strategy of this.strategies) {
            strategy.postIteration();
        }
    }

    /**
     * Call the strategies before an iteration.
     */
    preIteration() {

        this.iterationCount++;

        for (let strategy of this.strategies) {
            strategy.preIteration();
        }
    }

    /**
     * Perform the specified number of training iterations. This is a basic
     * implementation that just calls iteration the specified number of times.
     * However, some training methods, particularly with the GPU, benefit
     * greatly by calling with higher numbers than 1.
     *
     * @param {number} count
     *            The number of training iterations.
     */
    iteration(count = 1) {
    }
}

module.exports = BasicTraining;