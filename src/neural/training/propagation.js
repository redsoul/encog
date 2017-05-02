const LinearErrorFunction = require(__ERROR_FUNCTIONS + 'linear');
const GradientWorker = require(__TRAINING + 'gradientWorker');
const ArrayUtils = require(__UTILS + 'array');
const EncogError = require(__UTILS + 'encogError');
const BasicTraining = require(__TRAINING + 'basic');
/**
 * Implements basic functionality that is needed by each of the propagation
 * methods. The specifics of each of the propagation methods is implemented
 * inside of the PropagationMethod interface implementors.
 *
 * @author jheaton
 *
 */
class Propagation extends BasicTraining {

    /**
     * Construct a propagation object.
     *
     * @param network
     *            The network.
     * @param input
     *            The input training set.
     * @param output
     *            The input training set.
     */
    constructor(network, input, output) {
        super();

        this.dropoutRate = 0;

        this.workers = [];

        this.network = network;
        this.currentFlatNetwork = network.getFlat();

        this.gradients = ArrayUtils.newFloatArray(this.currentFlatNetwork.weights.length);
        this.lastGradient = ArrayUtils.newFloatArray(this.currentFlatNetwork.weights.length);

        this.input = input;
        this.output = output;
        this.numThreads = 0;
        this.reportedException = null;
        this.shouldFixFlatSpot = false;
        this.iterationCount = 0;

        this.l1 = null;
        this.l2 = null;

        this.flatSpot = [];
        this.finalized = false;
        /**
         * The batch size. Specify 1 for pure online training. Specify 0 for pure
         * batch training (complete training set in one batch). Otherwise specify
         * the batch size for batch training.
         */
        this.batchSize = 1;
        this.ef = new LinearErrorFunction();
        this.totalError = 0;
        this.error = null;
    }

    /**
     * Should be called after training has completed and the iteration method
     * will not be called any further.
     * @param dropoutRate {float}
     *            The input training set.
     */
    finishTraining(dropoutRate = 0) {
        if (!this.finalized) {
            const weights = this.currentFlatNetwork.weights;
            if (dropoutRate > 0) {
                for (let i = 0; i < weights.length; i++) {
                    weights[i] *= (1 - dropoutRate);
                }
            }
            this.finalized = true;
        }
    }

    /**
     * Init the process.
     */
    init() {
        const activationFunctionsLength = this.currentFlatNetwork.activationFunctions.length;
        this.flatSpot = ArrayUtils.newFloatArray(activationFunctionsLength);

        if (this.shouldFixFlatSpot) {
            for (let i = 0; i < activationFunctionsLength; i++) {
                const af = this.currentFlatNetwork.activationFunctions[i];

                if (typeof af == 'object' && af.constructor.name == "ActivationSigmoid") {
                    this.flatSpot[i] = 0.1;
                } else {
                    this.flatSpot[i] = 0.0;
                }
            }
        } else {
            ArrayUtils.fillArray(this.flatSpot, 0);
        }


        // setup workers

        // Do not use multi-threading for non-pure batch training.
        //
        // At some point it would be good to add multi-threading
        // for batch-sizes that are large enough.
        //
        // Multi-threading cannot be added for pure (size 1)
        // online training.
        // if (this.batchSize != 0) {
        //     this.numThreads = 1;
        // }

        this.workers.push(new GradientWorker(
            this.currentFlatNetwork.clone(),
            this,
            this.input,
            this.output,
            0,
            this.input.length - 1,
            this.flatSpot,
            this.ef));
    }

    /**
     * Apply and learn.
     */
    learn() {
        const weights = this.currentFlatNetwork.weights;
        for (let i = 0; i < this.gradients.length; i++) {
            weights[i] += this.updateWeight(this.gradients, this.lastGradient, i, this.dropoutRate);
            this.gradients[i] = 0;
        }
    }

    /**
     * Apply and learn. This is the same as learn, but it checks to see if any
     * of the weights are below the limit threshold. In this case, these weights
     * are zeroed out. Having two methods allows the regular learn method, which
     * is what is usually use, to be as fast as possible.
     */
    learnLimited() {
        const limit = this.currentFlatNetwork.connectionLimit;
        const weights = this.currentFlatNetwork.weights;
        for (let i = 0; i < this.gradients.length; i++) {
            if (Math.abs(weights[i]) < limit) {
                weights[i] = 0;
            } else {
                weights[i] += this.updateWeight(this.gradients, this.lastGradient, i, this.dropoutRate);
            }
            this.gradients[i] = 0;
        }
    }

    /**
     * Update a weight.
     *
     * @param gradients {Array} The gradients.
     * @param lastGradient {Array} The last gradients.
     * @param index {number} The index.
     * @param dropoutRate {number} The dropout rate.
     * @return {number} The weight delta.
     */
    updateWeight(gradients, lastGradient, index, dropoutRate) {

    }

    /**
     * Perform the specified number of training iterations. This can be more
     * efficient than single training iterations. This is particularly true if
     * you are training with a GPU.
     *
     * @param count {number}
     *            The number of training iterations.
     */
    iteration(count = 1) {

        for (let i = 0; i < count; i++) {

            this.preIteration();

            this.rollIteration();

            if (this.batchSize == 0) {
                this.processPureBatch();
            } else {
                this.processBatches();
            }

            for (let worker of this.workers) {
                ArrayUtils.arrayCopy(this.currentFlatNetwork.weights,
                    0, worker.weights, 0,
                    this.currentFlatNetwork.weights.length);
            }

            if (this.currentFlatNetwork.hasContext) {
                this.copyContexts();
            }

            if (this.reportedException != null) {
                throw (new EncogError(this.reportedException));
            }

            this.postIteration();

            EncogLog.info("Training iteration done, error: " + this.error);
        }

        EncogLog.print();
    }

    /**
     * Calculate the gradients.
     */
    calculateGradients() {
        if (this.workers.length == 0) {
            this.init();
        }

        if (this.currentFlatNetwork.hasContext) {
            this.workers[0].network.clearContext();
        }

        this.totalError = 0;

        if (this.workers.length > 1) {

        } else {
            this.workers[0].run();
        }

        this.error = this.totalError / this.workers.length;

    }

    /**
     * Increase the iteration by one.
     */
    rollIteration() {
        this.iterationCount++;
    }

    /**
     * Process as pure batch (size 0). Batch size equal to training set size.
     */
    processPureBatch() {
        this.calculateGradients();

        if (this.currentFlatNetwork.isLimited) {
            this.learnLimited();
        } else {
            this.learn();
        }
    }

    processBatches() {
        if (this.workers.length == 0) {
            this.init();
        }

        if (this.currentFlatNetwork.hasContext) {
            this.workers[0].network.clearContext();
        }

        this.workers[0].errorCalculation.reset();

        let lastLearn = 0;

        for (let i = 0; i < this.input.length; i++) {
            this.workers[0].run(i);

            lastLearn++;

            if (lastLearn++ >= this.batchSize) {
                if (this.currentFlatNetwork.isLimited) {
                    this.learnLimited();
                } else {
                    this.learn();
                    lastLearn = 0;
                }
            }
        }

        // handle any remaining learning
        if (lastLearn > 0) {
            this.learn();
        }

        this.error = this.workers[0].errorCalculation.calculate();
    }

    /**
     * {@inheritDoc}
     * @param gradients {Array}
     * @param error {number}
     */
    report(gradients, error, ex) {
        if (ex == null) {
            for (let i = 0; i < gradients.length; i++) {
                this.gradients[i] += gradients[i];
            }
            this.totalError += error;
        } else {
            this.reportedException = ex;
        }
    }

    /**
     * Copy the contexts to keep them consistent with multithreaded training.
     */
    copyContexts() {
        // copy the contexts(layer outputO from each group to the next group
        for (let i = 0; i < (this.workers.length - 1); i++) {
            ArrayUtils.arrayCopy(this.workers[i].network.layerOutput, this.workers[i + 1].network.layerOutput);
        }

        // copy the contexts from the final group to the real network
        ArrayUtils.arrayCopy(this.workers[this.workers.length - 1].network.layerOutput, this.currentFlatNetwork.layerOutput);
    }
}

module.exports = Propagation;