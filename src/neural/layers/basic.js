const FlatLayer = require(PATHS.LAYERS + 'flat');
const ActivationSigmoid = require(PATHS.ACTIVATION_FUNCTIONS + 'sigmoid');

/**
 * Basic functionality that most of the neural layers require. The basic layer
 * is often used by itself to implement forward or recurrent layers. Other layer
 * types are based on the basic layer as well.
 *
 */
const _network = Symbol('network');
class BasicLayer extends FlatLayer {
    /**
     * Construct a basic layer.
     *
     * @param activation {ActivationFunction}
     *            The activation function.
     * @param hasBias {boolean}
     *            The neuron count.
     * @param neuronCount {number}
     *            The bias activation.
     * @param dropoutRate {number}
     *              The dropout rate for this layer
     */
    constructor(activation, hasBias, neuronCount, dropoutRate = 0) {
        if (arguments.length == 1) {
            super(new ActivationSigmoid(), arguments[0], 1.0);
        } else {
            super(activation, neuronCount, hasBias ? 1.0 : 0.0, dropoutRate);
        }
        this.network = null;
    }

    /**
     * @returns {BasicNetwork}
     */
    get network() {
        return this[_network];
    }

    /**
     * @param network {BasicNetwork}
     */
    set network(network) {
        this[_network] = network;
    }
}

module.exports = BasicLayer;