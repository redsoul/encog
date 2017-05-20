const HopfieldNetwork = require(PATHS.NETWORKS + 'hopfield');
const NeuralNetworkPattern = require(PATHS.PATTERNS + 'neuralNetwork');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');

/**
 * Create a Hopfield pattern. A Hopfield neural network has a single layer that
 * functions both as the input and output layers. There are no hidden layers.
 * Hopfield networks are used for basic pattern recognition. When a Hopfield
 * network recognizes a pattern, it "echos" that pattern on the output.
 *
 * @author jheaton
 *
 */

class HopfieldPattern extends NeuralNetworkPattern {
    constructor() {
        super();
        this.neuronCount = 0;
    }

    /**
     * Add a hidden layer. This will throw an error, because the Hopfield neural
     * network has no hidden layers.
     */
    addHiddenLayer() {
        throw new NeuralNetworkError("A Hopfield network has no hidden layers.");
    }

    /**
     * Set the number of input neurons, this must match the output neurons.
     *
     * @param count {Number} The number of neurons.
     */
    setInputLayer(count) {
        this.neuronCount = count;
    }

    /**
     * Set the number of output neurons, should not be used with a hopfield
     * neural network, because the number of input neurons defines the number of
     * output neurons.
     *
     * @param count {Number} The number of neurons.
     */
    setOutputLayer(count) {
        throw new NeuralNetworkError("A Hopfield network has a single layer, so no need "
            + "to specify the output count.");

    }

    /**
     * @inheritDoc
     */
    generate() {
        return new HopfieldNetwork(this.neuronCount);
    }
}

module.exports = HopfieldPattern;