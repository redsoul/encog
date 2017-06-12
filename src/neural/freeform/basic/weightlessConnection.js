const ArrayUtils = require(PATHS.UTILS + 'array');
const BasicFreeformConnection = require(PATHS.FREEFORM + 'basic/connection');
/**
 * A basic freeform connection.
 *
 */
class WeightlessConnection extends BasicFreeformConnection {


    /**
     * Construct a Gated connection.
     * @param theSource {FreeformNeuron} The source neuron.
     * @param theTarget {FreeformNeuron} The target neuron.
     */
    constructor(theSource, theTarget) {
        super(theSource, theTarget);
        this.weight = 1.0;
    }

    /**
     * @inheritDoc
     */
    addWeight(delta) {
    }

    /**
     * @inheritDoc
     */
    setWeight(weight) {
    }
}

module.exports = WeightlessConnection;