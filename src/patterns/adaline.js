const BasicLayer = require(PATHS.LAYERS + 'basic');
const BasicNetwork = require(PATHS.NETWORKS + 'basic');
const NeuralNetworkPattern = require(PATHS.PATTERNS + 'neuralNetwork');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
const FreeformNetwork = require(PATHS.FREEFORM + 'network');

/**
 * Construct an ADALINE neural network.
 */

class ADALINEPattern extends NeuralNetworkPattern {
    constructor() {
        super();
    }

    /**
     * @inheritDoc
     */
    addHiddenLayer() {
        throw new NeuralNetworkError("An ADALINE network has no hidden layers.");
    }

    /**
     * @inheritDoc
     */
    generate() {
        const network = new BasicNetwork();

        const inputLayer = new BasicLayer(this.inputLayer.activationFunction, true, this.inputLayer.neurons);
        const outputLayer = new BasicLayer(this.outputLayer.activationFunction, false, this.outputLayer.neurons);

        network.addLayer(inputLayer);
        network.addLayer(outputLayer);
        network.reset();

        return network;
    }

    /**
     * @inheritDoc
     */
    generateFreeformNetwork() {
        const network = new FreeformNetwork();

        const inputLayer = network.createInputLayer(this.inputLayer.neurons);
        const outputLayer = network.createOutputLayer(this.outputLayer.neurons);

        network.connectLayers(inputLayer, outputLayer, this.outputLayer.activationFunction, 1.0);
        network.reset();

        return network;
    }
}

module.exports = ADALINEPattern;