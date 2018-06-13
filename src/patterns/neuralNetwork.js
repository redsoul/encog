const ActivationSigmoid = require(PATHS.ACTIVATION_FUNCTIONS + 'sigmoid');
/**
 * Patterns are used to create common sorts of neural networks. Information
 * about the structure of the neural network is communicated to the pattern, and
 * then generate is called to produce a neural network of this type.
 *
 * @author jheaton
 *
 */
class NeuralNetworkPattern {

    constructor() {
        this.clear();
    }

    /**
     * Add the specified hidden layer.
     *
     * @param neuronsCount {number} The number of neurons in the hidden layer.
     * @param activationFunc {ActivationFunction} The Activation Function
     */
    addHiddenLayer(neuronsCount, activationFunc = new ActivationSigmoid()) {
        this.hiddenLayers.push({
            neurons: neuronsCount,
            activationFunction: activationFunc
        });
    }

    /**
     * Clear the hidden layers so that they can be redefined.
     */
    clear() {
        this.hiddenLayers = [];
        this.inputLayer = null;
        this.outputLayer = null;
    }

    /**
     * Generate the specified neural network.
     *
     * @return {BasicNetwork} The resulting neural network.
     */
    generate() {

    }

    /**
     * Generate the freeform version of specified neural network.
     *
     * @return {FreeformNetwork} The resulting neural network.
     */
    generateFreeformNetwork(){

    }

    /**
     * @param neuronsCount {number} The number of neurons in the hidden layer.
     * @param activationFunc {ActivationFunction} The Activation Function
     */
    setInputLayer(neuronsCount, activationFunc = new ActivationSigmoid()) {
        this.inputLayer = {
            neurons: neuronsCount,
            activationFunction: activationFunc
        };
    }

    /**
     * @param neuronsCount {number} The number of neurons in the hidden layer.
     * @param activationFunc {ActivationFunction} The Activation Function
     */
    setOutputLayer(neuronsCount, activationFunc = new ActivationSigmoid()) {
        this.outputLayer = {
            neurons: neuronsCount,
            activationFunction: activationFunc
        };
    }
}

module.exports = NeuralNetworkPattern;