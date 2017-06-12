const ArrayUtils = require(PATHS.UTILS + 'array');
const FreeformNeuron = require(PATHS.FREEFORM + 'interfaces/neuron');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
var cuid = require('cuid');
/**
 * This class provides a basic implementation of a freeform neuron.
 */
class BasicFreeformNeuron extends FreeformNeuron {

    /**
     * @param theInputSummation {InputSummation}
     */
    constructor(theInputSummation) {
        super();
        this.inputSummation = theInputSummation;
        this.tempTraining = [];
        this.outputConnections = [];
        this.layerName = null;
        this.layer = null;
        this.name = null;
        this.id = cuid();
    }

    /**
     * @inheritDoc
     */
    addInput(connection) {
        this.inputSummation.add(connection);
    }

    /**
     * @inheritDoc
     */
    addOutput(connection) {
        this.outputConnections.push(connection);
    }

    /**
     * @inheritDoc
     */
    addTempTraining(i, value) {
        this.tempTraining[i] += value;
    }

    /**
     * @inheritDoc
     */
    allocateTempTraining(l) {
        this.tempTraining = ArrayUtils.newFloatArray(l);
    }

    /**
     * @inheritDoc
     */
    clearTempTraining() {
        this.tempTraining = null;
    }

    /**
     * @inheritDoc
     */
    getActivation() {
        return this.activation;
    }

    /**
     * @inheritDoc
     */
    getInputSummation() {
        return this.inputSummation;
    }

    /**
     * @inheritDoc
     */
    getOutputs() {
        return this.outputConnections;
    }

    /**
     * @inheritDoc
     */
    getSum() {
        if (this.inputSummation == null) {
            return this.activation;
        } else {
            return this.inputSummation.getSum();
        }
    }

    /**
     * @inheritDoc
     */
    getTempTraining(index) {
        return this.tempTraining[index];
    }

    /**
     * @inheritDoc
     */
    isBias() {
        return this.bias;
    }

    /**
     * @inheritDoc
     */
    performCalculation() {
        // no inputs? Just keep activation as is, probably a bias neuron.
        if (this.getInputSummation() == null) {
            return;
        }

        this.activation = this.inputSummation.calculate();
        if (isNaN(this.activation)) {
            throw new NeuralNetworkError('Activation is not a number');
        }
    }

    /**
     * @inheritDoc
     */
    setActivation(theActivation) {
        if (isNaN(theActivation)) {
            throw new NeuralNetworkError('Trying to set the activation with a non numeric value');
        }
        this.activation = theActivation;
    }

    /**
     * @inheritDoc
     */
    setBias(bias) {
        this.bias = bias;
    }

    /**
     * @inheritDoc
     */
    setInputSummation(theInputSummation) {
        this.inputSummation = theInputSummation;
    }

    /**
     * @inheritDoc
     */
    setTempTraining(index, value) {
        this.tempTraining[index] = value;
    }

    /**
     * @inheritDoc
     */
    updateContext() {
        // nothing to do for a non-context neuron
    }
}

module.exports = BasicFreeformNeuron;