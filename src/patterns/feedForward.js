const BasicLayer = require(__LAYERS + 'basic');
const BasicNetwork = require(__NETWORKS + 'basic');

/**
 * Used to create feedforward neural networks. A feedforward network has an
 * input and output layers separated by zero or more hidden layers. The
 * feedforward neural network is one of the most common neural network patterns.
 *
 * @author jheaton
 *
 */

class FeedForwardPattern {
    constructor() {
        this.hiddenLayers = [];
        this.activationOutput = null;
        this.activationHidden = null;
        this.inputNeurons = null;
        this.outputNeurons = null;
    }

    /**
     * Add a hidden layer, with the specified number of neurons.
     *
     * @param count {number}
     *            The number of neurons to add.
     */
    addHiddenLayer(count) {
        this.hiddenLayers.push(count);
    }

    /**
     * Clear out any hidden neurons.
     */
    clear() {
        this.hiddenLayers = [];
    }

    /**
     * Generate the feedforward neural network.
     *
     * @return {FeedForwardPattern} The feedforward neural network.
     */
    generate() {
        if (this.activationOutput == null) {
            this.activationOutput = this.activationHidden;
        }

        const input = new BasicLayer(null, true, this.inputNeurons);

        const result = new BasicNetwork();
        result.addLayer(input);


        for (let hiddenCount of this.hiddenLayers) {

            let hidden = new BasicLayer(this.activationHidden, true, hiddenCount);

            result.addLayer(hidden);
        }

        const output = new BasicLayer(this.activationOutput, false, this.outputNeurons);
        result.addLayer(output);

        result.getStructure().finalizeStructure();
        result.reset();

        return result;
    }
}