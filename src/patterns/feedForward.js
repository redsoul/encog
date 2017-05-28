const BasicLayer = require(PATHS.LAYERS + 'basic');
const BasicNetwork = require(PATHS.NETWORKS + 'basic');
const NeuralNetworkPattern = require(PATHS.PATTERNS + 'neuralNetwork');
const FreeformNetwork = require(PATHS.FREEFORM + 'network');

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
    }

    /**
     * @inheritDoc
     */
    generate() {
        const input = new BasicLayer(this.inputLayer.activationFunction, true, this.inputLayer.neurons);
        const network = new BasicNetwork();

        network.addLayer(input);

        for (let hiddenLayer of this.hiddenLayers) {
            network.addLayer(new BasicLayer(hiddenLayer.activationFunction, true, hiddenLayer.neurons));
        }

        const output = new BasicLayer(this.outputLayer.activationFunction, false, this.outputLayer.neurons);
        network.addLayer(output);
        network.reset();

        return network;
    }

    /**
     * @inheritDoc
     */
    generateFreeformNetwork() {
        const network = new FreeformNetwork();
        let lastLayer = network.createInputLayer(this.inputLayer.neurons);
        let currentLayer;

        for (let hiddenLayer of this.hiddenLayers) {
            currentLayer = network.createLayer(hiddenLayer.neurons);
            network.connectLayers(lastLayer, currentLayer, hiddenLayer.activationFunction, 1.0, false);
            lastLayer = currentLayer;
        }

        currentLayer = network.createOutputLayer(this.outputLayer.neurons);
        network.connectLayers(lastLayer, currentLayer, this.outputLayer.activationFunction, null, false);

        network.reset();
        return network;
    }
}

module.exports = FeedForwardPattern;