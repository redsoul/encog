const BasicRandomizer = require(PATHS.RANDOMIZERS + 'basic');
/**
 * Implementation of <i>Nguyen-Widrow</i> weight initialization. This is the
 * default weight initialization used by Encog, as it generally provides the
 * most train-able neural network.
 */
class NguyenWidrowRandomizer extends BasicRandomizer {
    /**
     * Randomize the synapses and biases in the basic network based on an array,
     * modify the array. Previous values may be used, or they may be discarded,
     * depending on the randomizer.
     *
     * @param network {BasicNetwork}
     *            A network to randomize.
     */
    randomize(network) {
        for (let fromLayer = 0; fromLayer < network.getLayerCount() - 1; fromLayer++) {
            this.randomizeSynapse(network, fromLayer);
        }
    }

    /**
     * @param network {BasicNetwork}
     * @param fromLayer {Number}
     */
    randomizeSynapse(network, fromLayer) {
        let toLayer = fromLayer + 1;
        let toCount = network.getLayerNeuronCount(toLayer);
        let fromCount = network.getLayerNeuronCount(fromLayer);
        let fromCountTotalCount = network.getLayerTotalNeuronCount(fromLayer);
        const af = network.getActivation(toLayer);
        let low = this.calculateRange(af, Number.MIN_SAFE_INTEGER);
        let high = this.calculateRange(af, Number.MAX_SAFE_INTEGER);

        let b = 0.7 * Math.pow(toCount, (1.0 / fromCount)) / (high - low);

        for (let toNeuron = 0; toNeuron < toCount; toNeuron++) {
            if (fromCount != fromCountTotalCount) {
                let w = this.nextDouble(-b, b);
                network.setWeight(fromLayer, fromCount, toNeuron, w);
            }
            for (let fromNeuron = 0; fromNeuron < fromCount; fromNeuron++) {
                const w = this.nextDouble(0, b);
                network.setWeight(fromLayer, fromNeuron, toNeuron, w);
            }
        }
    }

    /**
     * @param af {ActivationFunction}
     * @param r {float}
     * @returns {int}
     */
    static calculateRange(af, r) {
        let d = [r];
        af.activationFunction(d, 0, 1);
        return d[0];
    }
}

module.exports = NguyenWidrowRandomizer;