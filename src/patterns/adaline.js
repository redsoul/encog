const BasicLayer = require(__LAYERS + 'basic');
const BasicNetwork = require(__NETWORKS + 'basic');
const NeuralNetworkPattern = require(__PATTERNS + 'neuralNetwork');
const NeuralNetworkError = require(__NETWORKS + '../neuralNetworkError');
const ActivationLinear = require(__ACTIVACTION_FUNCTIONS + 'linear');
const RangeRandomizer = require(__RANDOMIZERS + 'range');

/**
 * Construct an ADALINE neural network.
 */

class ADALINEPattern extends NeuralNetworkPattern {
    constructor() {
    }

    /**
     * @inheritDoc
     */
    addHiddenLayer(count) {
        throw new NeuralNetworkError("An ADALINE network has no hidden layers.");
    }

    /**
     * @inheritDoc
     */
    clear() {
        this.inputNeurons = 0;
        this.outputNeurons = 0;
    }

    /**
     * @inheritDoc
     */
    generate() {
        const network = new BasicNetwork();

        const inputLayer = new BasicLayer(new ActivationLinear(), true, this.inputNeurons);
        const outputLayer = new BasicLayer(new ActivationLinear(), false, this.outputNeurons);

        network.addLayer(inputLayer);
        network.addLayer(outputLayer);
        network.structure.finalizeStructure();

        (new RangeRandomizer(-0.5, 0.5)).randomize(network);

        return network;
    }
}

module.exports = ADALINEPattern;