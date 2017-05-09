const FlatNetwork = require(PATHS.NETWORKS + 'flat');
const BasicNetwork = require(PATHS.NETWORKS + 'basic');
const ActivationLinear = require(PATHS.ACTIVATION_FUNCTIONS + 'linear');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
/**
 * Holds "cached" information about the structure of the neural network. This is
 * a very good performance boost since the neural network does not need to
 * traverse itself each time a complete collection of layers or synapses is
 * needed.
 *
 * @author jheaton
 *
 */
const _flat = Symbol('flat');
class NeuralStructure {
    constructor(network) {
        /**
         * The neural network this class belongs to.
         */
        this.network = network;
        this.layers = [];
        this.flat = null;
    }

    /**
     * Add a new layer to the structure
     * @param layer {BasicLayer}
     */
    addLayer(layer) {
        this.layers.push(layer);
    }

    /**
     * Enforce that all connections are above the connection limit. Any
     * connections below this limit will be severed.
     */
    enforceLimit() {
        if (!this.connectionLimited) {
            return;
        }

        const weights = this.flat.weights;

        for (let i = 0; i < weights.length; i++) {
            if (Math.abs(weights[i]) < this.connectionLimit) {
                weights[i] = 0;
            }
        }
    }

    /**
     * Parse/finalize the limit value for connections.
     */
    finalizeLimit() {
        this.connectionLimited = false;
        this.connectionLimit = 0;
    }

    /**
     * Build the synapse and layer structure. This method should be called after
     * you are done adding layers to a network, or change the network's logic
     * property.
     * @param dropout Is dropout used?
     */
    finalizeStructure(dropout = false) {

        if (this.layers.length < 2) {
            throw new NeuralNetworkError("There must be at least two layers before the structure is finalized.");
        }

        let flatLayers = [];

        for (let layer of this.layers) {
            if (layer.activation == null) {
                layer.activation = new ActivationLinear();
            }

            flatLayers.push(layer);
        }

        this.flat = new FlatNetwork(flatLayers, dropout);

        this.finalizeLimit();
        this.layers = [];
        this.enforceLimit();
    }

    /**
     * Throw an error if there is no flat network.
     */
    requireFlat() {
        if (this[_flat] == null) {
            throw new NeuralNetworkError("Must call finalizeStructure before using this network.");
        }
    }

    /**
     * @returns {FlatNetwork}
     */
    get flat() {
        this.requireFlat();
        return this[_flat];
    }

    /**
     * @param flat {FlatNetwork}
     */
    set flat(flat) {
        this[_flat] = flat
    }

    /**
     * Calculate the size that an array should be to hold all of the weights and
     * bias values.
     *
     * @return {number} The size of the calculated array.
     */
    calculateSize() {
        return this.network.encodedArrayLength();
    }
}

module.exports = NeuralStructure;