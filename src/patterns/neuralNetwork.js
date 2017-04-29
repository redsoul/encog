/**
 * Patterns are used to create common sorts of neural networks. Information
 * about the structure of the neural network is communicated to the pattern, and
 * then generate is called to produce a neural network of this type.
 *
 * @author jheaton
 *
 */
class NeuralNetworkPattern {
    /**
     * Add the specified hidden layer.
     *
     * @param count {number}
     *            The number of neurons in the hidden layer.
     */
    addHiddenLayer(count) {
    }

    /**
     * Clear the hidden layers so that they can be redefined.
     */
    clear() {
    }

    /**
     * Generate the specified neural network.
     *
     * @return {BasicNetwork} The resulting neural network.
     */
    generate() {
    }
}

module.exports = NeuralNetworkPattern;