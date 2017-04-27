const Strategy = require(__STRATAGIES + '../strategy');
/**
 * Attempt to automatically set the learning rate in a learning method that
 * supports a learning rate.
 *
 * @author jheaton
 *
 */
class SmartLearningRate extends Strategy {
    constructor() {
        super();
        /**
         * Learning decay rate.
         */
        this.LEARNING_DECAY = 0.99;
    }

    /**
     * Initialize this strategy.
     *
     * @param train {Propagation}
     *            The training algorithm.
     */
    init(train) {
        this.ready = false;
        this.train = train;
        this.trainingSize = train.input.length;
        this.currentLearningRate = 1.0 / this.trainingSize;
        EncogLog.debug("Starting learning rate: " + this.currentLearningRate).print();
        this.train.learningRate = this.currentLearningRate;
    }

    /**
     * Called just after a training iteration.
     */
    postIteration() {
        if (this.ready) {
            if (this.train.error > this.lastError) {
                this.currentLearningRate *= this.LEARNING_DECAY;
                this.train.learningRate = this.currentLearningRate;
                EncogLog.debug("Adjusting learning rate to {}" + this.currentLearningRate).print();
            }
        } else {
            this.ready = true;
        }

    }

    /**
     * Called just before a training iteration.
     */
    preIteration() {
        this.lastError = this.train.error;
    }
}

module.exports = SmartLearningRate;