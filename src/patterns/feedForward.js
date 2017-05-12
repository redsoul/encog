const BasicLayer = require(PATHS.LAYERS + 'basic');
const BasicNetwork = require(PATHS.NETWORKS + 'basic');
const NeuralNetworkPattern = require(PATHS.PATTERNS + 'neuralNetwork');

/**
 * Used to create feedforward neural networks. A feedforward network has an
 * input and output layers separated by zero or more hidden layers. The
 * feedforward neural network is one of the most common neural network patterns.
 *
 * @author jheaton
 *
 */

class FeedForwardPattern extends NeuralNetworkPattern {
    constructor() {
        super();
        this.hiddenLayers = [];
        this.activationOutput = null;
        this.activationHidden = null;
        this.inputNeurons = null;
        this.outputNeurons = null;
    }

    /**
     * @inheritDoc
     */
    addHiddenLayer(count) {
        this.hiddenLayers.push(count);
    }

    /**
     * @inheritDoc
     */
    clear() {
        this.hiddenLayers = [];
    }

    /**
     * @inheritDoc
     */
    generate() {
        if (this.activationOutput == null) {
            this.activationOutput = this.activationHidden;
        }

        const input = new BasicLayer(null, true, this.inputNeurons);
        const result = new BasicNetwork();

        result.addLayer(input);

        for (let hiddenCount of this.hiddenLayers) {
            result.addLayer(new BasicLayer(this.activationHidden, true, hiddenCount));
        }

        const output = new BasicLayer(this.activationOutput, false, this.outputNeurons);
        result.addLayer(output);

        result.structure.finalizeStructure();
        result.reset();

        return result;
    }
}

module.exports = FeedForwardPattern;