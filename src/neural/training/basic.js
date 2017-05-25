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
     * Should be called once training is complete and no more iterations are
     * needed. Calling iteration again will simply begin the training again, and
     * require finishTraining to be called once the new training session is
     * complete.
     *
     * It is particularly important to call finishTraining for multithreaded
     * training techniques.
     */
    finishTraining() {
    }

    /**
     * @return {Boolean} True if the training can be paused, and later continued.
     */
    canContinue(){}

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

    /**
     * @return {Number}
     *         Returns the training error. This value is calculated as the
     *         training data is evaluated by the iteration function. This has
     *         two important ramifications. First, the value returned by
     *         getError() is meaningless prior to a call to iteration. Secondly,
     *         the error is calculated BEFORE training is applied by the call to
     *         iteration. The timing of the error calculation is done for
     *         performance reasons.
     */
    getError() {
        return this.error;
    }

    /**
     * @param error {Number}
     *            Set the current error rate. This is usually used by training
     *            strategies.
     */
    setError(error) {
        this.error = error;
    }

    /**
     * @return {TrainingImplementationType} The training implementation type.
     */
    getImplementationType() {
    }

    /**
     * @return {Number} The current training iteration.
     */
    getIteration() {
    }

    /**
     * Set the current training iteration.
     *
     * @param iteration {Number}
     *            Iteration.
     */
    setIteration(iteration) {
    }
}

module.exports = BasicTraining;