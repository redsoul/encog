const BasicLayer = require(PATHS.LAYERS + 'basic');
const BasicNetwork = require(PATHS.NETWORKS + 'basic');
const NeuralNetworkPattern = require(PATHS.PATTERNS + 'neuralNetwork');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
const ActivationSigmoid = require(PATHS.ACTIVATION_FUNCTIONS + 'sigmoid');
const FreeformNetwork = require(PATHS.FREEFORM + 'network');

/**
 * This class is used to generate an Jordan style recurrent neural network. This
 * network type consists of three regular layers, an input output and hidden
 * layer. There is also a context layer which accepts output from the output
 * layer and outputs back to the hidden layer.
 * This makes it a recurrent neural network.
 *
 * The Jordan neural network is useful for temporal input data.
 * The Jordan neural network is similar to the Elman neural network.
 *
 * @author jheaton
 *
 */

class JordanPattern extends NeuralNetworkPattern {
    constructor() {
        super();
    }

    /**
     * @inheritDoc
     */
    addHiddenLayer(neuronsCount, activationFunc = new ActivationSigmoid()) {
        if (this.hiddenLayers.length >= 1) {
            throw new NeuralNetworkError("A Jordan neural network should have only one hidden layer.");
        }
        super.addHiddenLayer(neuronsCount, activationFunc);
    }

    /**
     * @inheritDoc
     */
    generate() {
        if (!this.inputLayer || this.hiddenLayers.length == 0 || !this.outputLayer) {
            throw new NeuralNetworkError("A Jordan neural network should have input, hidden and output layers defined");
        }

        const network = new BasicNetwork();
        const hidden = new BasicLayer(this.hiddenLayers[0].activationFunction, true, this.hiddenLayers[0].neurons);
        const output = new BasicLayer(this.outputLayer.activationFunction, false, this.outputLayer.neurons);

        hidden.contextFedBy = output;

        network.addLayer(new BasicLayer(this.inputLayer.activationFunction, true, this.inputLayer.neurons));
        network.addLayer(hidden);
        network.addLayer(output);
        network.randomize();

        return network;
    }

    /**
     * @inheritDoc
     */
    generateFreeformNetwork() {
        if (!this.inputLayer || this.hiddenLayers.length == 0 || !this.outputLayer) {
            throw new NeuralNetworkError("A Jordan neural network should have input, hidden and output layers defined");
        }

        const network = new FreeformNetwork();
        const inputLayer = network.createInputLayer(this.inputLayer.neurons);
        const hiddenLayer1 = network.createLayer(this.hiddenLayers[0].neurons);
        const contextLayer = network.createLayer(1);
        const outputLayer = network.createOutputLayer(this.outputLayer.neurons);

        network.connectLayers(inputLayer, hiddenLayer1, this.hiddenLayers[0].activationFunction, 1.0);
        network.connectLayers(hiddenLayer1, outputLayer, this.outputLayer.activationFunction, 1.0);
        network.connectLayers(outputLayer, contextLayer, this.outputLayer.activationFunction, 1.0);
        network.createContext(outputLayer, contextLayer);

        network.reset();

        return network;
    }
}

module.exports = JordanPattern;