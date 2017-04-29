const BasicLayer = require(__LAYERS + 'basic');
const BasicNetwork = require(__NETWORKS + 'basic');
const NeuralNetworkPattern = require(__PATTERNS + 'neuralNetwork');
const NeuralNetworkError = require(__NETWORKS + '../neuralNetworkError');
const ActivationSigmoid = require(__ACTIVACTION_FUNCTIONS + 'sigmoid');

/**
 * This class is used to generate an Elman style recurrent neural network. This
 * network type consists of three regular layers, an input output and hidden
 * layer. There is also a context layer which accepts output from the hidden
 * layer and outputs back to the hidden layer. This makes it a recurrent neural
 * network.
 *
 * The Elman neural network is useful for temporal input data. The specified
 * activation function will be used on all layers. The Elman neural network is
 * similar to the Jordan neural network.
 *
 * @author jheaton
 *
 */

class ElmanPattern extends NeuralNetworkPattern {
    constructor() {
        this.inputNeurons = -1;
        this.outputNeurons = -1;
        this.hiddenNeurons = -1;
    }

    /**
     * @inheritDoc
     */
    addHiddenLayer(count) {
        throw new NeuralNetworkError("An Elman neural network should have only one hidden layer.");
    }

    /**
     * @inheritDoc
     */
    clear() {
        this.hiddenLayers = -1;
    }

    /**
     * @inheritDoc
     */
    generate() {
        if (!this.activation) {
            this.activation = new ActivationSigmoid();
        }

        const network = new BasicNetwork();
        const input = new BasicLayer(this.activation, true, this.inputNeurons);
        const hidden = new BasicLayer(this.activation, true, this.hiddenNeurons);

        input.contextFedBy = hidden;

        network.addLayer(input);
        network.addLayer(hidden);
        network.addLayer(new BasicLayer(null, false, this.outputNeurons));

        network.structure.finalizeStructure();
        network.reset();

        return network;
    }
}

module.exports = ElmanPattern;