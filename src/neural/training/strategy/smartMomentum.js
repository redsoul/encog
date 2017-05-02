const Strategy = require(__STRATEGIES + '../strategy');
/**
 * Attempt to automatically set a momentum in a training algorithm that supports
 * momentum.
 *
 *
 * @author jheaton
 *
 */
class SmartMomentum extends Strategy {
    constructor() {
        super();
        /**
         * The minimum improvement to adjust momentum.
         */
        this.MIN_IMPROVEMENT = 0.0001;
        /**
         * The maximum value that momentum can go to.
         */
        this.MAX_MOMENTUM = 4;

        /**
         * The starting momentum.
         */
        this.START_MOMENTUM = 0.1;

        /**
         * How much to increase momentum by.
         */
        this.MOMENTUM_INCREASE = 0.01;

        /**
         * How many cycles to accept before adjusting momentum.
         */
        this.MOMENTUM_CYCLES = 10;
    }

    /**
     * Initialize this strategy.
     *
     * @param train {Propagation}
     *            The training algorithm.
     */
    init(train) {
        this.train = train;
        this.ready = false;
        this.train.momentum = 0.0;
        this.currentMomentum = 0;
    }

    /**
     * Called just after a training iteration.
     */
    postIteration() {
        if (this.ready) {
            const currentError = this.train.error;
            this.lastImprovement = (currentError - this.lastError) / this.lastError;
            EncogLog.debug("Last improvement: " + this.lastImprovement);

            if ((this.lastImprovement > 0) || (Math.abs(this.lastImprovement) < this.MIN_IMPROVEMENT)) {
                this.lastMomentum++;

                if (this.lastMomentum > this.MOMENTUM_CYCLES) {
                    this.lastMomentum = 0;
                    if (parseInt(this.currentMomentum, 10) == 0) {
                        this.currentMomentum = this.START_MOMENTUM;
                    }
                    this.currentMomentum *= (1.0 + this.MOMENTUM_INCREASE);
                    this.train.momentum = this.currentMomentum;
                    EncogLog.debug("Adjusting momentum: " + this.currentMomentum);
                }
            } else {
                EncogLog.debug("Setting momentum back to zero.");

                this.currentMomentum = 0;
                this.train.momentum = 0;
            }
        } else {
            this.ready = true;
        }

        EncogLog.print();
    }

    /**
     * Called just before a training iteration.
     */
    preIteration() {
        this.lastError = this.train.error;
    }
}

module.exports = SmartMomentum;