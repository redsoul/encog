const NeuralStructure = require(PATHS.NETWORKS + '../structure');
const _ = require('lodash');
const NguyenWidrowRandomizer = require(PATHS.RANDOMIZERS + 'nguyenWidrow');
const RangeRandomizer = require(PATHS.RANDOMIZERS + 'range');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');

/**
 * This class implements a neural network. This class works in conjunction the
 * Layer classes. Layers are added to the BasicNetwork to specify the structure
 * of the neural network.
 *
 * The first layer added is the input layer, the final layer added is the output
 * layer. Any layers added between these two layers are the hidden layers.
 *
 * The network structure is stored in the structure member. It is important to
 * call:
 *
 * network.getStructure().finalizeStructure();
 *
 * Once the neural network has been completely constructed.
 *
 */
class BasicNetwork {
    constructor() {
        this.structure = new NeuralStructure(this);
    }

    /**
     * Add a layer to the neural network. If there are no layers added this
     * layer will become the input layer. This function automatically updates
     * both the input and output layer references.
     *
     * @param layer {BasicLayer}
     *            The layer to be added to the network.
     */
    addLayer(layer) {
        layer.network = this;
        this.structure.addLayer(layer);
    }

    /**
     * Add to a weight.
     * @param fromLayer {number} The from layer.
     * @param fromNeuron {number} The from neuron.
     * @param toNeuron {number} The to neuron.
     * @param value {number} The value to add.
     */
    addWeight(fromLayer, fromNeuron, toNeuron, value) {
        const old = this.getWeight(fromLayer, fromNeuron, toNeuron);
        this.setWeight(fromLayer, fromNeuron, toNeuron, old + value);
    }

    /**
     * Get the weight between the two layers.
     * @param fromLayer {number} The from layer.
     * @param fromNeuron {number} The from neuron.
     * @param toNeuron {number} The to neuron.
     * @return {number} The weight value.
     */
    getWeight(fromLayer, fromNeuron, toNeuron) {
        this.structure.requireFlat();
        return this.structure.flat.getWeight(fromLayer, fromNeuron, toNeuron);
    }

    /**
     * Set the weight between the two specified neurons. The bias neuron is always
     * the last neuron on a layer.
     * @param fromLayer {number} The from layer.
     * @param fromNeuron {number} The from neuron.
     * @param toNeuron {number} The to neuron.
     * @param value {number} The to value.
     */
    setWeight(fromLayer, fromNeuron, toNeuron, value) {
        this.structure.requireFlat();
        const fromLayerNumber = this.getLayerCount() - fromLayer - 1;
        const toLayerNumber = fromLayerNumber - 1;

        if (toLayerNumber < 0) {
            throw new NeuralNetworkError("The specified layer is not connected to another layer: " + fromLayer);
        }

        const weightBaseIndex = this.structure.flat.weightIndex[toLayerNumber];
        const count = this.structure.flat.layerCounts[fromLayerNumber];
        const weightIndex = weightBaseIndex + fromNeuron + (toNeuron * count);

        this.structure.flat.setWeight(value, weightIndex);
    }

    /**
     * Get the total (including bias and context) neuron cont for a layer.
     * @param layer {number} The layer.
     * @return {number} The count.
     */
    getLayerTotalNeuronCount(layer) {
        this.structure.requireFlat();
        const layerNumber = this.getLayerCount() - layer - 1;
        return this.structure.flat.layerCounts[layerNumber];
    }

    /**
     * Get the neuron count.
     * @param layer {number} The layer.
     * @return {number} The neuron count.
     */
    getLayerNeuronCount(layer) {
        this.structure.requireFlat();
        const layerNumber = this.getLayerCount() - layer - 1;
        return this.structure.flat.layerFeedCounts[layerNumber];
    }

    /**
     * @return {number} The layer count.
     */
    getLayerCount() {
        this.structure.requireFlat();
        return this.structure.flat.layerCounts.length;
    }

    /**
     * @returns {FlatNetwork}
     */
    getFlat() {
        return this.structure.flat;
    }

    /**
     * Calculate the error for this neural network.  We always calculate the error
     * using the "regression" calculator.  Neural networks don't directly support
     * classification, rather they use one-of-encoding or similar.  So just using
     * the regression calculator gives a good approximation.
     *
     * @param data
     *            The training set.
     * @return {float} The error percentage.
     */
    calculateError(data) {
        return EncogUtility.calculateRegressionError(this, data);
    }

    /**
     * Calculate the total number of neurons in the network across all layers.
     *
     * @return {number} The neuron count.
     */
    calculateNeuronCount() {
        let result = 0;
        for (let layer of this.structure.layers) {
            result += layer.getNeuronCount();
        }
        return result;
    }

    /**
     * Classify the input into a group.
     * @param {Array} input The input data to classify.
     * @return {number} The group that the data was classified into.
     */
    classify(input) {
        return this.winner(input);
    }

    /**
     * Clear any data from any context layers.
     */
    clearContext() {
        if (this.structure.flat != null) {
            this.structure.flat.clearContext();
        }
    }

    /**
     * Determines the randomizer used for resets. This will normally return a
     * Nguyen-Widrow randomizer with a range between -1 and 1. If the network
     * does not have an input, output or hidden layers, then Nguyen-Widrow
     * cannot be used and a simple range randomize between -1 and 1 will be
     * used. Range randomizer is also used if the activation function is not
     * TANH, Sigmoid, or the Elliott equivalents.
     *
     * @return the randomizer
     */
    getRandomizer() {
        let useNWR = true;
        const validNwrActivationFunctions = [
            'ActivationTANH',
            'ActivationSigmoid',
            'ActivationElliott',
            'ActivationElliottSymmetric'
        ];
        const layerCount = this.getLayerCount();

        for (let i = 0; i < layerCount; i++) {
            const af = this.getActivation(i);
            if (!_.find(validNwrActivationFunctions, af.constructor.name)) {
                useNWR = false;
                break;
            }
        }

        if (layerCount < 3) {
            useNWR = false;
        }

        return useNWR ? new NguyenWidrowRandomizer() : new RangeRandomizer(-1, 1);
    }

    /**
     * Determine the winner for the specified input. This is the number of the
     * winning neuron.
     *
     * @param input {Array}
     *            The input patter to present to the neural network.
     * @return {number} The winning neuron.
     */
    winner(input) {
        const output = this.compute(input);
        return _.max(output);
    }

    /**
     * Compute the output for this network.
     *
     * @param input {Array}
     *            The input.
     * @return {Array}
     *            The output.
     */
    compute(input) {
        try {
            return this.structure.flat.compute(input);
        } catch (ex) {
            throw new NeuralNetworkError(
                "Index exception: there was likely a mismatch between layer sizes, or the size of the input presented to the network.",
                ex);
        }
    }

    /**
     * Get the activation function for the specified layer.
     * @param layer {number} The layer.
     * @return {ActivationFunction} The activation function.
     */
    getActivation(layer) {
        this.structure.requireFlat();
        const layerNumber = this.getLayerCount() - layer - 1;
        return this.structure.flat.activationFunctions[layerNumber];
    }

    /**
     * Reset the weight matrix and the bias values. This will use a
     * Nguyen-Widrow randomizer with a range between -1 and 1. If the network
     * does not have an input, output or hidden layers, then Nguyen-Widrow
     * cannot be used and a simple range randomize between -1 and 1 will be
     * used.
     *
     */
    reset() {
        this.getRandomizer().randomize(this);
    }

    /**
     * @return {number} The length of an encoded array.
     */
    encodedArrayLength() {
        this.structure.requireFlat();
        return this.structure.flat.getEncodeLength();
    }
}

module.exports = BasicNetwork;