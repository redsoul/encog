const BasicLayer = require(PATHS.LAYERS + 'basic');
const BasicNetwork = require(PATHS.NETWORKS + 'basic');
const NeuralNetworkPattern = require(PATHS.PATTERNS + 'neuralNetwork');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
const ActivationSigmoid = require(PATHS.ACTIVATION_FUNCTIONS + 'sigmoid');

/**
 * This class is used to generate an Jordan style recurrent neural network. This
 * network type consists of three regular layers, an input output and hidden
 * layer. There is also a context layer which accepts output from the output
 * layer and outputs back to the hidden layer. This makes it a recurrent neural
 * network.
 *
 * The Jordan neural network is useful for temporal input data. The specified
 * activation function will be used on all layers. The Jordan neural network is
 * similar to the Elman neural network.
 *
 * @author jheaton
 *
 */

class JordanPattern extends NeuralNetworkPattern {
    constructor() {
        super();
        this.inputNeurons = null;
        this.outputNeurons = null;
        this.hiddenNeurons = null;
    }

    /**
     * @inheritDoc
     */
    addHiddenLayer(count) {
        throw new NeuralNetworkError("A Jordan neural network should have only one hidden layer.");
    }

    /**
     * @inheritDoc
     */
    clear() {
        this.hiddenNeurons = null;
    }

    /**
     * @inheritDoc
     */
    generate() {
        if (!this.activation) {
            this.activation = new ActivationSigmoid();
        }

        if (!this.inputNeurons || !this.hiddenNeurons || !this.outputNeurons) {
            throw new NeuralNetworkError("A Jordan neural network should have input, hidden and output layers defined");
        }

        const network = new BasicNetwork();
        const hidden = new BasicLayer(this.activation, true, this.hiddenNeurons);
        const output = new BasicLayer(this.activation, false, this.outputNeurons);

        hidden.contextFedBy = output;

        network.addLayer(new BasicLayer(null, true, this.inputNeurons));
        network.addLayer(hidden);
        network.addLayer(output);

        network.structure.finalizeStructure();
        network.reset();

        return network;
    }
}

module.exports = JordanPattern;