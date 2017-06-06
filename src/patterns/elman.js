const BasicLayer = require(PATHS.LAYERS + 'basic');
const BasicNetwork = require(PATHS.NETWORKS + 'basic');
const FreeformNetwork = require(PATHS.FREEFORM + 'network');
const NeuralNetworkPattern = require(PATHS.PATTERNS + 'neuralNetwork');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
const ActivationSigmoid = require(PATHS.ACTIVATION_FUNCTIONS + 'sigmoid');

/**
 * This class is used to generate an Elman style recurrent neural network. This
 * network type consists of three regular layers, an input output and hidden
 * layer. There is also a context layer which accepts output from the hidden
 * layer and outputs back to the input layer.
 * This makes it a recurrent neural network.
 *
 * The Elman neural network is useful for temporal input data.
 * The Elman neural network is similar to the Jordan neural network.
 *
 * @author jheaton
 *
 */

class ElmanPattern extends NeuralNetworkPattern {
    constructor() {
        super();
    }

    /**
     * @inheritDoc
     */
    addHiddenLayer(neuronsCount, activationFunc = new ActivationSigmoid()) {
        if (this.hiddenLayers.length >= 1) {
            throw new NeuralNetworkError("An Elman neural network should have only one hidden layer.");
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
        let network = new BasicNetwork();
        const input = new BasicLayer(this.inputLayer.activationFunction, true, this.inputLayer.neurons);
        const hidden = new BasicLayer(this.hiddenLayers[0].activationFunction, true, this.hiddenLayers[0].neurons);

        hidden.contextFedBy = hidden;

        network.addLayer(input);
        network.addLayer(hidden);
        network.addLayer(new BasicLayer(this.outputLayer.activationFunction, false, this.outputLayer.neurons));

        network.reset();
        return network;
    }

    generateFreeformNetwork() {
        if (!this.inputLayer || this.hiddenLayers.length == 0 || !this.outputLayer) {
            throw new NeuralNetworkError("A Jordan neural network should have input, hidden and output layers defined");
        }

        let network = new FreeformNetwork();
        const inputLayer = network.createInputLayer(this.inputLayer.neurons);
        const hiddenLayer1 = network.createLayer(this.hiddenLayers[0].neurons);
        const outputLayer = network.createOutputLayer(this.outputLayer.neurons);

        network.connectLayers(inputLayer, hiddenLayer1, this.hiddenLayers[0].activationFunction, 1.0);
        network.connectLayers(hiddenLayer1, outputLayer, this.outputLayer.activationFunction, 1.0);
        network.createContext(hiddenLayer1, hiddenLayer1);

        network.reset();
        return network;
    }
}

module.exports = ElmanPattern;