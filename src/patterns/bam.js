const BamNetwork = require(PATHS.NETWORKS + 'bam');
const NeuralNetworkPattern = require(PATHS.PATTERNS + 'neuralNetwork');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');

/**
 * Construct a Bidirectional Access Memory (BAM) neural network. This neural
 * network type learns to associate one pattern with another. The two patterns
 * do not need to be of the same length. This network has two that are connected
 * to each other. Though they are labeled as input and output layers to Encog,
 * they are both equal, and should simply be thought of as the two layers that
 * make up the net.
 *
 */

class BamPattern extends NeuralNetworkPattern {
    constructor() {
        super();
        this.neuronCount = 0;
    }

    /**
     * Add a hidden layer. This will throw an error, because the Hopfield neural
     * network has no hidden layers.
     */
    addHiddenLayer() {
        throw new NeuralNetworkError("A BAM network has no hidden layers.");
    }

    /**
     * Clear any settings on the pattern.
     */
    clear() {
        this.f1Neurons = 0;
        this.f2Neurons = 0;
    }

    /**
     * Set the F1 neurons. The BAM really does not have an input and output
     * layer, so this is simply setting the number of neurons that are in the
     * first layer.
     *
     * @param count {Number}
     *            The number of neurons in the first layer.
     */
    setF1Neurons(count) {
        this.f1Neurons = count;
    }

    /**
     * Set the output neurons. The BAM really does not have an input and output
     * layer, so this is simply setting the number of neurons that are in the
     * second layer.
     *
     * @param count {Number}
     *            The number of neurons in the second layer.
     */
    setF2Neurons(count) {
        this.f2Neurons = count;
    }

    /**
     * Set the number of input neurons, this must match the output neurons.
     *
     * @param count {Number} The number of neurons.
     */
    setInputLayer(count) {
        throw new NeuralNetworkError( "A BAM network has no input layer, consider setting F1 layer.");
    }

    /**
     * Set the number of output neurons, should not be used with a hopfield
     * neural network, because the number of input neurons defines the number of
     * output neurons.
     *
     * @param count {Number} The number of neurons.
     */
    setOutputLayer(count) {
        throw new NeuralNetworkError("A BAM network has no output layer, consider setting F2 layer.");

    }

    /**
     * @inheritDoc
     */
    generate() {
        return new BamNetwork(this.f1Neurons, this.f2Neurons);
    }
}

module.exports = BamPattern;