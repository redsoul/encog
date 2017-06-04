const BasicTraining = require(PATHS.TRAINING + 'basic');
const ErrorCalculation = require(PATHS.ERROR_CALCULATION + 'errorCalculation');

/**
 * Provides basic propagation functions to other trainers.
 */
class FreeformPropagationTraining extends BasicTraining {

    /**
     * Construct the trainer.
     * @param theNetwork {FreeformNetwork} The network to train.
     * @param theInput {Array} The training data.
     * @param theOutput {Array} The training data.
     */
    constructor(theNetwork, theInput, theOutput) {
        super();
        this.FLAT_SPOT_CONST = 0.1;

        this.network = theNetwork;
        this.input = theInput;
        this.output = theOutput;
        this.batchSize = 0;
        this.fixFlatSopt = true;
        this.visited = [];
    }

    /**
     * Calculate the gradient for a neuron.
     * @param toNeuron {FreeformNeuron} The neuron to calculate for.
     */
    calculateNeuronGradient(toNeuron) {

        // Only calculate if layer has inputs, because we've already handled the
        // output
        // neurons, this means a hidden layer.
        if (toNeuron.getInputSummation() != null) {

            // between the layer deltas between toNeuron and the neurons that
            // feed toNeuron.
            // also calculate all inbound gradeints to toNeuron
            for (let connection of toNeuron.getInputSummation().list()) {

                // calculate the gradient
                const gradient = connection.getSource().getActivation() * toNeuron.getTempTraining(0);
                connection.addTempTraining(0, gradient);

                // calculate the next layer delta
                const fromNeuron = connection.getSource();
                let sum = 0;
                for (let toConnection of fromNeuron.getOutputs()) {
                    sum += toConnection.getTarget().getTempTraining(0) * toConnection.getWeight();
                }
                const neuronOutput = fromNeuron.getActivation();
                const neuronSum = fromNeuron.getSum();
                let deriv = toNeuron.getInputSummation().getActivationFunction().derivativeFunction(neuronSum, neuronOutput);

                if (this.fixFlatSopt && (toNeuron.getInputSummation().getActivationFunction().constructor.name === 'ActivationSigmoid')) {
                    deriv += this.FLAT_SPOT_CONST;
                }

                fromNeuron.setTempTraining(0, sum * deriv);
            }

            // recurse to the next level
            for (let connection of toNeuron.getInputSummation().list()) {
                let fromNeuron = connection.getSource();
                this.calculateNeuronGradient(fromNeuron);
            }

        }

    }

    /**
     * Calculate the output delta for a neuron, given its difference.
     * Only used for output neurons.
     * @param neuron {FreeformNeuron}
     * @param diff {Number}
     */
    calculateOutputDelta(neuron, diff) {
        const neuronOutput = neuron.getActivation();
        const neuronSum = neuron.getInputSummation().getSum();
        let deriv = neuron.getInputSummation().getActivationFunction().derivativeFunction(neuronSum, neuronOutput);
        if (this.fixFlatSopt && (neuron.getInputSummation().getActivationFunction().constructor.name === 'ActivationSigmoid')) {
            deriv += this.FLAT_SPOT_CONST;
        }
        neuron.setTempTraining(0, deriv * diff);
    }

    /**
     * @inheritDoc
     */
    canContinue() {
        return false;
    }

    /**
     * @inheritDoc
     */
    finishTraining() {
        this.network.tempTrainingClear();
    }

    /**
     * @inheritDoc
     */
    getError() {
        return this.error;
    }

    /**
     * @inheritDoc
     */
    getImplementationType() {
        return TrainingImplementationType.Iterative;
    }

    /**
     * @inheritDoc
     */
    getIteration() {
        return this.iterationCount;
    }

    /**
     * @return {Boolean} True, if we are fixing the flat spot problem.
     */
    isFixFlatSopt() {
        return this.fixFlatSopt;
    }

    /**
     * @inheritDoc
     */
    iteration(count = 1) {
        for (let i = 0; i < count; i++) {
            this.preIteration();
            this.iterationCount++;
            this.network.clearContext();

            if (this.batchSize == 0) {
                this.processPureBatch();
            } else {
                this.processBatches();
            }

            this.postIteration();
        }
    }

    /**
     * Process training for pure batch mode (one single batch).
     */
    processPureBatch() {
        const errorCalc = new ErrorCalculation();
        this.visited = [];
        let input;
        let ideal;
        let actual;
        let sig;

        for (let j = 0; j < this.input.length; j++) {
            input = this.input[j];
            ideal = this.output[j];
            actual = this.network.compute(input);
            sig = 1;

            errorCalc.updateError(actual, ideal, sig);

            for (let i = 0; i < this.network.getOutputCount(); i++) {
                const diff = (ideal[i] - actual[i]) * sig;
                const neuron = this.network.getOutputLayer().getNeurons()[i];
                this.calculateOutputDelta(neuron, diff);
                this.calculateNeuronGradient(neuron);
            }
        }

        // Set the overall error.
        this.setError(errorCalc.calculate());

        // Learn for all data.
        this.learn();
    }

    /**
     * Process training batches.
     */
    processBatches() {
        let lastLearn = 0;
        const errorCalc = new ErrorCalculation();
        this.visited = [];
        let input;
        let ideal;
        let actual;
        let sig;

        for (let j = 0; j < this.input.length; j++) {
            input = this.input[j];
            ideal = this.output[j];
            actual = this.network.compute(input);
            sig = 1;

            errorCalc.updateError(actual.getData(), ideal.getData(), sig);

            for (let i = 0; i < this.network.getOutputCount(); i++) {
                const diff = (ideal.getData(i) - actual.getData(i)) * sig;
                const neuron = this.network.getOutputLayer().getNeurons()[i];
                this.calculateOutputDelta(neuron, diff);
                this.calculateNeuronGradient(neuron);
            }

            // Are we at the end of a batch.
            lastLearn++;
            if (lastLearn >= this.batchSize) {
                lastLearn = 0;
                this.learn();
            }
        }

        // Handle any remaining data.
        if (lastLearn > 0) {
            this.learn();
        }

        // Set the overall error.
        this.setError(errorCalc.calculate());
    }

    /**
     * Learn for the entire network.
     */
    learn() {
        const that = this;
        this.network.performConnectionTask((connection)=> {
            that.learnConnection(connection);
            connection.setTempTraining(0, 0);
        });
    }

    /**
     * Learn for a single connection.
     * @param connection The connection to learn from.
     */
    learnConnection(connection){}

    /**
     * @inheritDoc
     */
    setError(theError) {
        this.error = theError;

    }

    /**
     * Set if we should fix the flat spot problem.
     * @param fixFlatSopt {Boolean} True, if we should fix the flat spot problem.
     */
    setFixFlatSopt(fixFlatSopt) {
        this.fixFlatSopt = fixFlatSopt;
    }

    /**
     * @inheritDoc
     */
    setIteration(iteration) {
        this.iterationCount = iteration;
    }

    /**
     * @return The batch size.
     */
    getBatchSize() {
        return batchSize;
    }

    /**
     * Set the batch size.
     * @param batchSize {Number} The batch size.
     */
    setBatchSize(batchSize) {
        this.batchSize = batchSize;
    }
}

module.exports = FreeformPropagationTraining;