const BasicRandomizer = require(PATHS.RANDOMIZERS + 'basic');
/**
 * A randomizer that will create random weight and bias values that are between
 * a specified range.
 *
 * @author jheaton
 *
 */
class RangeRandomizer extends BasicRandomizer {
    /**
     * Construct a range randomizer.
     *
     * @param min {number}
     *            The minimum random value.
     * @param max {number}
     *            The maximum random value.
     */
    constructor(min, max) {
        super();
        this.min = min;
        this.max = max;
    }

    /**
     * Randomize the synapses and biases in the basic network based on an array,
     * modify the array. Previous values may be used, or they may be discarded,
     * depending on the randomizer.
     *
     * @param network {BasicNetwork}
     *            A network to randomize.
     */
    randomize() {
        if (arguments.length == 1) {
            if (typeof arguments[0] == 'object' && arguments[0].constructor.name == 'BasicNetwork') {
                const network = arguments[0];
                for (let i = 0; i < network.getLayerCount() - 1; i++) {
                    this.randomizeNetworkLayer(network, i);
                }
            } else {
                return this.nextDouble(this.min, this.max);
            }
        } else {
            const min = arguments[0];
            const max = arguments[1];
            return this.nextDouble(min, max);
        }
    }

    /**
     * @param min {number}
     *            The minimum random value.
     * @param max {number}
     *            The maximum random value.
     */
    nextDouble(min, max) {
        const range = max - min;
        return (range * Math.random()) + min;
    }
}

module.exports = RangeRandomizer;