const MersenneTwisterGenerateRandom = require(__GENERATORS + 'mersenneTwister');
/**
 * Provides basic functionality that most randomizers will need.
 *
 * @author jheaton
 *
 */
class BasicRandomizer {

    constructor() {
        this.random = new MersenneTwisterGenerateRandom();
    }

    /**
     * Randomize one level of a neural network.
     *
     * @param network {BasicNetwork}
     *            The network to randomize
     * @param fromLayer {number}
     *            The from level to randomize.
     */
    randomizeNetworkLayer(network, fromLayer) {
        const fromCount = network.getLayerTotalNeuronCount(fromLayer);
        const toCount = network.getLayerNeuronCount(fromLayer + 1);

        for (let fromNeuron = 0; fromNeuron < fromCount; fromNeuron++) {
            for (let toNeuron = 0; toNeuron < toCount; toNeuron++) {
                let v = network.getWeight(fromLayer, fromNeuron, toNeuron);
                v = this.randomize(v);
                network.setWeight(fromLayer, fromNeuron, toNeuron, v);
            }
        }
    }

    /**
     * Randomize the synapses and biases in the basic network based on an array,
     * modify the array. Previous values may be used, or they may be discarded,
     * depending on the randomizer.
     *
     * @param network {BasicNetwork}
     *            A network to randomize.
     */
    randomize(network) {
        for (let i = 0; i < network.getLayerCount() - 1; i++) {
            this.randomizeNetworkLayer(network, i);
        }
    }

    /**
     * Generate a random number in the specified range.
     *
     * @param min {number}
     *            The minimum value.
     * @param max {number}
     *            The maximum value.
     * @return {number} A random number.
     */
    nextDouble(min, max) {
        if (arguments.length == 0) {
            return this.random.nextDouble();
        } else if (arguments.length == 2) {
            const range = max - min;
            return (range * this.random.nextDouble()) + min;
        }
    }
}

module.exports = BasicRandomizer;