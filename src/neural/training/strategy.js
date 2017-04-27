/**
 * Training strategies can be added to training algorithms.  Training
 * strategies allow different additional logic to be added to an existing
 * training algorithm.  There are a number of different training strategies
 * that can perform various tasks, such as adjusting the learning rate or
 * momentum, or terminating training when improvement diminishes.  Other
 * strategies are provided as well.
 *
 * @author jheaton
 *
 */
class Strategy {
    /**
     * Initialize this strategy.
     * @param train The training algorithm.
     */
    init(train) {
    };

    /**
     * Called just before a training iteration.
     */
    preIteration() {
    };

    /**
     * Called just after a training iteration.
     */
    postIteration() {
    };
}

module.exports = Strategy;